import styled from "styled-components";
import React, { useState, useCallback } from "react";
import CategoryName1 from "../../../assets/faq/CategoryName1.svg";
import CategoryName2 from "../../../assets/faq/CategoryName2.svg";
import CategoryName3 from "../../../assets/faq/CategoryName3.svg";
import CategoryName4 from "../../../assets/faq/CategoryName4.svg";
import CategoryName5 from "../../../assets/faq/CategoryName5.svg";
import ActiveIcon from "../../../assets/common/Active.svg";
import InactiveIcon from "../../../assets/common/InActive.svg";

// 타입
interface FAQCategory {
  categoryId: string;
  categoryName: string;
  categoryNameImage: string;
  description: string;
  faqCount: number;
  isActive: boolean;
}

// 데이터
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

const TABLE_COLUMNS = [
  { key: "categoryName", label: "카테고리명", width: "200px" },
  { key: "description", label: "설명", width: "400px" },
  { key: "isActive", label: "상태", width: "150px" },
  { key: "faqCount", label: "FAQ 수", width: "150px" },
  { key: "action", label: "작업", width: "150px" }
];

// 컴포넌트
const FAQCategoryTable: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null);
  const [categoryData, setCategoryData] = useState<FAQCategory[]>(CATEGORY_DATA);

  const handleRowClick = useCallback((category: FAQCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleArchive = useCallback((categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategoryData(prevData => 
      prevData.map(category => 
        category.categoryId === categoryId 
          ? { ...category, isActive: !category.isActive }
          : category
      )
    );
  }, []);

  const renderTableRow = useCallback((category: FAQCategory) => (
    <TableRow 
      key={category.categoryId}
      onClick={() => handleRowClick(category)}
      selected={selectedCategory?.categoryId === category.categoryId}
    >
      <CategoryNameCell>
        <CategoryImage src={category.categoryNameImage} alt={category.categoryName} />
      </CategoryNameCell>
      <DescriptionCell>
        <DescriptionText>{category.description}</DescriptionText>
      </DescriptionCell>
      <StatusCell>
        <StatusIcon 
          src={category.isActive ? ActiveIcon : InactiveIcon} 
          alt={category.isActive ? "활성" : "비활성"} 
        />
      </StatusCell>
      <FAQCountCell>
        <FAQCountText>{category.faqCount}개</FAQCountText>
      </FAQCountCell>
      <ActionCell>
        <ActionText onClick={(e) => handleArchive(category.categoryId, e)}>
          {category.isActive ? "보관" : "복원"}
        </ActionText>
      </ActionCell>
    </TableRow>
  ), [selectedCategory, handleRowClick, handleArchive]);

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>카테고리 목록</TableTitle>
      </TableHeader>
      <HeaderBox>
        <TableHeaderRow>
          {TABLE_COLUMNS.map((column) => (
            <TableHeaderCell 
              key={column.key} 
              width={column.width}
            >
              {column.label}
            </TableHeaderCell>
          ))}
        </TableHeaderRow>
      </HeaderBox>
      <TableBody>
        {categoryData.map(renderTableRow)}
      </TableBody>
    </TableContainer>
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
  width: 1062.75px;
  height: 75px;
  border-radius: 19.5px 19.5px 0 0;
  border-bottom: 1.5px solid #E9E0F0;
  background: var(--color-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 var(--padding-36);
`;

const HeaderBox = styled.div`
  width: 1062px;
  height: 60px;
  border-bottom: 1.5px solid #E9E0F0;
  background: #FFF;
`;

const TableHeaderRow = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const TableHeaderCell = styled.div<{ width: string }>`
  width: ${props => props.width};
  color: #000;
  font-size: var(--font-size-16);
  font-weight: 500;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--padding-16) var(--padding-24);
`;

const TableTitle = styled.h2`
  color: #000;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
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
`;

const CategoryNameCell = styled.div`
  width: 200px;
  padding: var(--padding-16) var(--padding-24);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DescriptionCell = styled.div`
  width: 400px;
  padding: var(--padding-16) var(--padding-24);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusCell = styled.div`
  width: 150px;
  padding: var(--padding-16) var(--padding-24);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FAQCountCell = styled.div`
  width: 150px;
  padding: var(--padding-16) var(--padding-24);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionCell = styled.div`
  width: 150px;
  padding: var(--padding-16) var(--padding-24);
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-size: 15px;
  font-weight: 500;
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