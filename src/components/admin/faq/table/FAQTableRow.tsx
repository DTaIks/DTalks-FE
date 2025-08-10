import React from "react";
import styled from "styled-components";
import ActiveIcon from "@/assets/common/Active.svg";
import InactiveIcon from "@/assets/common/InActive.svg";
import { type FAQItem } from "@/types/faq";
import { useFAQDetail } from "@/query/useFAQQueries";

interface FAQTableRowProps {
  faq: FAQItem;
  isExpanded: boolean;
  onRowToggle: (faqId: number) => void;
  onEdit: (faq: FAQItem) => Promise<void>;
  onArchiveClick: (faq: FAQItem) => void;
}

const FAQTableRow: React.FC<FAQTableRowProps> = ({
  faq,
  isExpanded,
  onRowToggle,
  onEdit,
  onArchiveClick
}) => {
  const { data: faqDetail, error: detailError } = useFAQDetail(faq.faqId, isExpanded);

  const handleEditClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // 비활성화된 FAQ는 수정할 수 없음
    if (!faq.isActive) {
      return;
    }
    await onEdit(faq);
  };

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onArchiveClick(faq);
  };

  const renderActionButtons = () => (
    <ActionContainer>
      <ActionText 
        onClick={handleEditClick} 
        $disabled={!faq.isActive}
        title={!faq.isActive ? "보관된 FAQ는 수정할 수 없습니다." : ""}
      >
        수정
      </ActionText>
      <ActionDivider />
      <ActionText onClick={handleArchiveClick}>보관</ActionText>
    </ActionContainer>
  );

  const renderExpandedContent = () => {
    const content = detailError ? (
      <ErrorText>답변을 불러오는데 실패했습니다.</ErrorText>
    ) : (
      <ExpandedAnswer>{faqDetail?.answer || '답변이 없습니다.'}</ExpandedAnswer>
    );

    return (
      <ExpandedRow>
        <ExpandedBox>
          <ExpandedHeader>
            <ExpandedTitle>답변 내용</ExpandedTitle>
          </ExpandedHeader>
          <ExpandedContent>{content}</ExpandedContent>
        </ExpandedBox>
      </ExpandedRow>
    );
  };

  const statusIcon = faq.isActive ? ActiveIcon : InactiveIcon;
  const statusAlt = faq.isActive ? "활성" : "비활성";

  return (
    <React.Fragment>
      <TableRow onClick={() => onRowToggle(faq.faqId)} $isExpanded={isExpanded}>
        <TableCell>
          <QuestionText>{faq.question}</QuestionText>
        </TableCell>
        <TableCell>
          <CategoryImage src={faq.categoryImage} alt={faq.category} />
        </TableCell>
        <TableCell>
          <StatusIcon src={statusIcon} alt={statusAlt} />
        </TableCell>
        <TableCell>
          <DateText>{faq.createdAt}</DateText>
        </TableCell>
        <TableCell>
          {renderActionButtons()}
        </TableCell>
      </TableRow>
      {isExpanded && renderExpandedContent()}
    </React.Fragment>
  );
};

export default FAQTableRow;

const TableRow = styled.div<{ $isExpanded?: boolean }>`
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
  cursor: pointer;
  padding: 28px 0;
  padding-left: 44px;
  
  &:hover {
    background-color: rgba(153, 102, 204, 0.05);
  }
  
  ${props => props.$isExpanded && `
    background-color: rgba(153, 102, 204, 0.05);
    border-bottom: none;
  `}
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #000;
  font-size: var(--font-size-16);
  font-weight: 500;
  
  &:nth-child(1) { width: 370px; }
  &:nth-child(2) { width: 160px; margin-right:-40px; justify-content: center; }
  &:nth-child(3) { width: 180px; justify-content: center; }
  &:nth-child(4) { width: 190px; }
  &:nth-child(5) { width: 120px; }
`;

const QuestionText = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
  line-height: 1;
  vertical-align: middle;
`;

const DateText = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
`;

const CategoryImage = styled.img<{ alt?: string }>`
  width: ${({ alt }) => alt?.includes('급여') ? '116.917px' : '97.5px'};
  height: 31.5px;
  object-fit: contain;
`;

const StatusIcon = styled.img<{ src: string; alt?: string }>`
  width: ${({ alt }) => alt === "비활성" ? '69px' : '56px'};
  height: 32px;
  object-fit: contain;
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const ActionDivider = styled.div`
  width: 1px;
  height: 12px;
  background-color: #E9E0F0;
`;

const ActionText = styled.span<{ $disabled?: boolean }>`
  color: ${props => props.$disabled ? '#C8C8C8' : '#000'};
  font-size: 16px;
  font-weight: 500;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: color 0.2s;
  
  &:hover {
    color: ${props => props.$disabled ? '#C8C8C8' : 'var(--color-mediumpurple-300)'};
  }
`;

const ExpandedRow = styled.div`
  width: 1062px;
  height: 200px;
  flex-shrink: 0;
  background: rgba(153, 102, 204, 0.05);
  animation: slideDown 0.3s ease-out;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ExpandedBox = styled.div`
  width: 974px;
  height: 164px;
  flex-shrink: 0;
  border-radius: 18.75px;
  background: #FFF;
  margin-top: 20px;
  margin-left: 44px;
`;

const ExpandedHeader = styled.div`
  width: 974px;
  height: 70px;
  border-radius: 18.2px 18.2px 0 0;
  border-bottom: 1.4px solid #E9E0F0;
  background: #FFF;
  display: flex;
  align-items: center;
`;

const ExpandedContent = styled.div`
  display: flex;
  align-items: center;
  height: 82px;
  margin-top: 4px;
`;

const ExpandedTitle = styled.h3`
  color: #000;
  font-size: var(--font-size-16);
  font-weight: 600;
  margin-left: 36px;
`;

const ExpandedAnswer = styled.p`
  color: #333;
  font-size: var(--font-size-16);
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
  white-space: pre-wrap;
  margin-left: 36px;
  margin-right: 36px;
  padding: 20px 0;
  display: flex;
  align-items: center;
  min-height: 82px;
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: var(--font-size-14);
  margin-left: 36px;
  margin-right: 36px;
  padding: 20px 0;
  display: flex;
  align-items: center;
  min-height: 82px;
`;