import styled from "styled-components";
import ActiveIcon from "@/assets/common/Active.svg";
import InactiveIcon from "@/assets/common/InActive.svg";
import type { FAQCategory } from "@/types/faq";

interface FAQCategoryTableRowProps {
  category: FAQCategory;
  isSelected: boolean;
  onRowClick: (category: FAQCategory) => void;
  onArchiveClick: (category: FAQCategory, e: React.MouseEvent) => void;
}

const FAQCategoryTableRow = ({ 
  category, 
  isSelected, 
  onRowClick, 
  onArchiveClick 
}: FAQCategoryTableRowProps) => {
  return (
    <TableRow 
      onClick={() => onRowClick(category)}
      selected={isSelected}
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
        <ActionText onClick={(e) => onArchiveClick(category, e)}>
          {category.isActive ? "보관" : "복원"}
        </ActionText>
      </TableCell>
    </TableRow>
  );
};

export default FAQCategoryTableRow;

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