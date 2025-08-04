import React, { useState, useCallback } from "react";
import styled from "styled-components";
import CategoryName1 from "../../../assets/faq/CategoryName1.svg";
import CategoryName2 from "../../../assets/faq/CategoryName2.svg";
import CategoryName3 from "../../../assets/faq/CategoryName3.svg";
import CategoryName4 from "../../../assets/faq/CategoryName4.svg";
import CategoryName5 from "../../../assets/faq/CategoryName5.svg";
import ActiveIcon from "../../../assets/common/Active.svg";
import InactiveIcon from "../../../assets/common/InActive.svg";
import ConfirmModal from "../../common/ConfirmModal";

interface FAQCategory {
  categoryId: string;
  categoryName: string;
  categoryNameImage: string;
  description: string;
  faqCount: number;
  isActive: boolean;
}

const CATEGORY_DATA: FAQCategory[] = [
  {
    categoryId: "1",
    categoryName: "IT/시스템",
    categoryNameImage: CategoryName1,
    description: "재택근무, 출입증, 사내 메신저 사용 등 사내 규정 관련 질문",
    faqCount: 3,
    isActive: true
  },
  {
    categoryId: "2", 
    categoryName: "사내 규정",
    categoryNameImage: CategoryName2,
    description: "재택근무, 출입증, 사내 메신저 사용 등 사내 규정 관련 질문",
    faqCount: 8,
    isActive: true
  },
  {
    categoryId: "3",
    categoryName: "근무 / 근태",
    categoryNameImage: CategoryName3,
    description: "재택근무, 출입증, 사내 메신저 사용 등 사내 규정 관련 질문",
    faqCount: 5,
    isActive: false
  },
  {
    categoryId: "4",
    categoryName: "급여 / 복리후생",
    categoryNameImage: CategoryName4,
    description: "재택근무, 출입증, 사내 메신저 사용 등 사내 규정 관련 질문",
    faqCount: 15,
    isActive: true
  },
  {
    categoryId: "5",
    categoryName: "복지 / 휴가",
    categoryNameImage: CategoryName5,
    description: "재택근무, 출입증, 사내 메신저 사용 등 사내 규정 관련 질문",
    faqCount: 12,
    isActive: true
  }
];

const FAQCategoryTable: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null);
  const [categoryData, setCategoryData] = useState<FAQCategory[]>(CATEGORY_DATA);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null as 'archive' | 'download' | 'restore' | null,
    categoryId: null as string | null,
    categoryName: ''
  });

  const handleRowClick = useCallback((category: FAQCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleArchive = useCallback((categoryId: string) => {
    setCategoryData(prevData => 
      prevData.map(category => 
        category.categoryId === categoryId 
          ? { ...category, isActive: !category.isActive }
          : category
      )
    );
  }, []);

  const handleArchiveClick = useCallback((category: FAQCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      type: category.isActive ? 'archive' : 'restore',
      categoryId: category.categoryId,
      categoryName: category.categoryName
    });
  }, []);

  const handleConfirmAction = useCallback(() => {
    if ((confirmModal.type === 'archive' || confirmModal.type === 'restore') && confirmModal.categoryId) {
      handleArchive(confirmModal.categoryId);
    }
    setConfirmModal({
      isOpen: false,
      type: null,
      categoryId: null,
      categoryName: ''
    });
  }, [confirmModal, handleArchive]);

  const handleCloseConfirmModal = useCallback(() => {
    setConfirmModal({
      isOpen: false,
      type: null,
      categoryId: null,
      categoryName: ''
    });
  }, []);

  const renderTableRow = useCallback((category: FAQCategory) => (
    <TableRow 
      key={category.categoryId}
      onClick={() => handleRowClick(category)}
      selected={selectedCategory?.categoryId === category.categoryId}
    >
      <TableCell>
        <CategoryImage src={category.categoryNameImage} alt={category.categoryName} />
      </TableCell>
      <TableCell>
        <DescriptionText>{category.description}</DescriptionText>
      </TableCell>
      <TableCell>
        <StatusIcon 
          src={category.isActive ? ActiveIcon : InactiveIcon} 
          alt={category.isActive ? "활성" : "비활성"} 
        />
      </TableCell>
      <TableCell>
        <FAQCountText>{category.faqCount}개</FAQCountText>
      </TableCell>
      <TableCell>
        <ActionText onClick={(e) => handleArchiveClick(category, e)}>
          {category.isActive ? "보관" : "복원"}
        </ActionText>
      </TableCell>
    </TableRow>
  ), [selectedCategory, handleRowClick, handleArchiveClick]);

  return (
    <>
      <TableContainer>
        <TableHeader>
          <TableTitle>카테고리 목록</TableTitle>
        </TableHeader>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>카테고리명</TableCell>
              <TableCell>설명</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>FAQ 수</TableCell>
              <TableCell>작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryData.map(renderTableRow)}
          </TableBody>
        </Table>
      </TableContainer>

      {confirmModal.isOpen && confirmModal.type && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmAction}
          fileName={confirmModal.categoryName}
          type={confirmModal.type as 'archive' | 'download' | 'restore'}
        />
      )}
    </>
  );
};

export default FAQCategoryTable;

const TableContainer = styled.div`
  width: 1062px;
  height: 586px;
  border-radius: var(--br-18);
  background: var(--color-white);
  box-shadow: 0 6px 18px 0 rgba(125, 93, 246, 0.10);
  overflow: hidden;
`;

const TableHeader = styled.div`
  width: 1062px;
  height: 76px;
  border-radius: 19.5px 19.5px 0 0;
  border-bottom: 1.5px solid #E9E0F0;
  background: var(--color-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 36px;
`;

const TableTitle = styled.h2`
  color: #000;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const Table = styled.div`
  width: 100%;
`;

const TableHead = styled.div`
  height: 60px;
  border-bottom: 1.5px solid #E9E0F0;
  background: #FFF;
  display: flex;
  align-items: center;
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 56px;
  padding-top: 28px;
`;

const TableRow = styled.div<{ selected?: boolean }>`
  width: 1062px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
  padding-left: 36px;
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #000;
  font-size: var(--font-size-16);
  font-weight: 500;
  
  &:nth-child(1) { width: 200px; }
  &:nth-child(2) { width: 380px; }
  &:nth-child(3) { width: 220px; justify-content: center; }
  &:nth-child(4) { width: 125px; }
  &:nth-child(5) { width: 125px; }
`;

const CategoryImage = styled.img<{ alt?: string }>`
  width: ${({ alt }) => alt?.includes('급여') ? '116.917px' : '97.5px'};
  height: 32px;
  object-fit: contain;
`;

const StatusIcon = styled.img<{ src: string; alt?: string }>`
  width: ${({ alt }) => alt === "비활성" ? '69px' : '56px'};
  height: 32px;
  object-fit: contain;
`;

const DescriptionText = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 380px;
`;

const FAQCountText = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
`;

const ActionText = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: var(--color-mediumpurple-300);
  }
`;