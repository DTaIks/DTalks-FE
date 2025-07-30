import styled from "styled-components";
import React, { useState } from "react";
import CategoryName1 from "../../../assets/faq/CategoryName1.svg";
import CategoryName2 from "../../../assets/faq/CategoryName2.svg";
import CategoryName3 from "../../../assets/faq/CategoryName3.svg";
import CategoryName4 from "../../../assets/faq/CategoryName4.svg";
import CategoryName5 from "../../../assets/faq/CategoryName5.svg";
import ActiveIcon from "../../../assets/common/Active.svg";
import InactiveIcon from "../../../assets/common/InActive.svg";

// Types
interface FAQCategory {
  categoryId: string;
  categoryName: string;
  categoryNameImage: string;
  description: string;
  faqCount: number;
  isActive: boolean;
}

// Data
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
  { key: "categoryName", label: "카테고리명" },
  { key: "description", label: "설명" },
  { key: "isActive", label: "상태" },
  { key: "faqCount", label: "FAQ 수" },
  { key: "action", label: "작업" }
];

// Component
const FAQCategoryTable: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null);

  const handleRowClick = (category: FAQCategory) => {
    setSelectedCategory(category);
  };

  const renderTableRow = (category: FAQCategory) => (
    <TableRow 
      key={category.categoryId}
      onClick={() => handleRowClick(category)}
      selected={selectedCategory?.categoryId === category.categoryId}
    >
      <TableCell>
        <CategoryImageContainer>
          <CategoryImage src={category.categoryNameImage} alt={category.categoryName} />
        </CategoryImageContainer>
      </TableCell>
      <TableCell isDescription={true}>
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
        <ActionText>보관</ActionText>
      </TableCell>
    </TableRow>
  );

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
              isDescription={column.key === "description"}
            >
              {column.label}
            </TableHeaderCell>
          ))}
        </TableHeaderRow>
      </HeaderBox>
      <TableBody>
        {CATEGORY_DATA.map(renderTableRow)}
      </TableBody>
    </TableContainer>
  );
};

export default FAQCategoryTable;

// Styled Components
const TableContainer = styled.div`
  width: 1062.75px;
  height: 586.5px;
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

const TableHeaderCell = styled.div<{ isDescription?: boolean }>`
  flex: ${({ isDescription }) => isDescription ? 2 : 1};
  color: #000;
  font-family: Pretendard;
  font-size: var(--font-size-16);
  font-weight: 500;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TableTitle = styled.h2`
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding-top: 28px;
`;

const TableRow = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
`;

const TableCell = styled.div<{ isDescription?: boolean }>`
  flex: ${({ isDescription }) => isDescription ? 2 : 1};
  padding: var(--padding-16) var(--padding-24);
  font-size: var(--font-size-14);
  color: var(--color-dimgray);
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
`;

const CategoryImageContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding-left: 40px;
`;

const CategoryImage = styled.img<{ alt?: string }>`
  width: ${({ alt }) => alt?.includes('급여') ? '116.917px' : '97.5px'};
  height: 31.5px;
  object-fit: contain;
`;

const StatusIcon = styled.img<{ src: string }>`
  width: ${({ src }) => src.includes('InActive') ? '60px' : '56px'};
  height: 28px;
  object-fit: contain;
`;

const DescriptionText = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 15px;
  font-weight: 500;
`;

const FAQCountText = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
`;

const ActionText = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
`;