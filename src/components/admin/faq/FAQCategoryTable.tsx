import styled from "styled-components";
import React, { useState } from "react";
import CategoryName1 from "../../../assets/faq/CategoryName1.svg";
import CategoryName2 from "../../../assets/faq/CategoryName2.svg";
import CategoryName3 from "../../../assets/faq/CategoryName3.svg";
import CategoryName4 from "../../../assets/faq/CategoryName4.svg";
import CategoryName5 from "../../../assets/faq/CategoryName5.svg";

interface FAQCategory {
  categoryId: string;
  categoryName: string;
  categoryNameImage: string;
  description: string;
  faqCount: number;
  isActive: boolean;
}

const FAQCategoryTable: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryData: FAQCategory[] = [
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

  const columns = [
    { key: "categoryName", label: "카테고리명" },
    { key: "description", label: "설명" },
    { key: "isActive", label: "상태" },
    { key: "faqCount", label: "FAQ 수" },
    { key: "action", label: "작업" }
  ];

  const handleRowClick = (category: FAQCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>카테고리 목록</TableTitle>
      </TableHeader>
      <HeaderBox>
        <TableHeaderRow>
          {columns.map((column, index) => (
            <TableHeaderCell 
              key={column.key} 
              isDescription={column.key === "description"}
              isAfterDescription={index > 1}
            >
              {column.label}
            </TableHeaderCell>
          ))}
        </TableHeaderRow>
      </HeaderBox>
      
      <Table>
        <TableBody>
          {categoryData.map((category) => (
            <TableRow 
              key={category.categoryId}
              onClick={() => handleRowClick(category)}
              isSelected={selectedCategory?.categoryId === category.categoryId}
            >
              <TableCell>
                <CategoryImage src={category.categoryNameImage} alt={category.categoryName} />
              </TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                <StatusBadge isActive={category.isActive}>
                  {category.isActive ? "활성" : "비활성"}
                </StatusBadge>
              </TableCell>
              <TableCell>{category.faqCount}개</TableCell>
              <TableCell>보관</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FAQCategoryTable;

// Styled Components
const TableContainer = styled.div`
  width: 1062.75px;
  height: 586.5px;
  flex-shrink: 0;
  border-radius: var(--br-18);
  background: var(--color-white);
  box-shadow: 0 6px 18px 0 rgba(125, 93, 246, 0.10);
  overflow: hidden;
`;

const TableHeader = styled.div`
  width: 1062.75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 19.5px 19.5px 0 0;
  border-bottom: 1.5px solid #E9E0F0;
  background: var(--color-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 var(--padding-36);
`;

const HeaderBox = styled.div`
  width: 1062.75px;
  height: 60px;
  flex-shrink: 0;
  border-bottom: 1.5px solid #E9E0F0;
  background: #FFF;
`;

const TableHeaderRow = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 36px 0 36px;
`;

const TableHeaderCell = styled.div<{ isDescription?: boolean; isAfterDescription?: boolean }>`
  flex: ${({ isDescription }) => isDescription ? 3 : 1};
  color: #000;
  font-family: Pretendard;
  font-size: var(--font-size-16);
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-align: ${({ isDescription }) => isDescription ? 'center' : 'left'};
  ${({ isAfterDescription }) => isAfterDescription && `
    margin-left: 40px;
  `}
`;

const TableTitle = styled.h2`
  color: #000;
  font-family: Pretendard;
  font-size: 19.5px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin: 0;
`;

const AddButton = styled.button`
  background: var(--color-mediumpurple-300);
  color: var(--color-white);
  border: none;
  border-radius: var(--br-6);
  padding: var(--padding-8) var(--padding-16);
  font-size: var(--font-size-14);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: var(--color-mediumpurple-400);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: var(--color-lightbluegray);
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ isSelected?: boolean }>`
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: var(--color-mediumpurple-500);
  }
  
  ${({ isSelected }) => isSelected && `
    background: var(--color-mediumpurple-500);
  `}
`;

const TableCell = styled.td`
  padding: var(--padding-16) var(--padding-24);
  padding-left: 24px;
  font-size: var(--font-size-14);
  color: var(--color-dimgray);
`;

const StatusBadge = styled.span<{ isActive: boolean }>`
  padding: var(--padding-4) var(--padding-8);
  border-radius: var(--br-5);
  font-size: var(--font-size-12);
  font-weight: 500;
  background: ${({ isActive }) => isActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  color: ${({ isActive }) => isActive ? '#4CAF50' : '#F44336'};
`;

const CategoryImage = styled.img`
  width: 97.5px;
  height: 31.5px;
  object-fit: contain;
`; 