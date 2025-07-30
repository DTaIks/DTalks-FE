import styled from "styled-components";
import CategoryName1 from "../../../assets/faq/CategoryName1.svg";
import CategoryName2 from "../../../assets/faq/CategoryName2.svg";
import CategoryName3 from "../../../assets/faq/CategoryName3.svg";
import CategoryName4 from "../../../assets/faq/CategoryName4.svg";
import CategoryName5 from "../../../assets/faq/CategoryName5.svg";
import ActiveIcon from "../../../assets/common/Active.svg";
import InactiveIcon from "../../../assets/common/InActive.svg";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  categoryImage: string;
  isActive: boolean;
  createdAt: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "계정 비밀번호를 변경하는 방법은?",
    answer: "계정 설정에서 비밀번호 변경에 대한 안내입니다.",
    category: "IT/시스템",
    categoryImage: CategoryName1,
    isActive: true,
    createdAt: "2024-01-16 14:30",
  },
  {
    id: 2,
    question: "계정 비밀번호를 변경하는 방법은?",
    answer: "계정 설정에서 비밀번호 변경에 대한 안내입니다.",
    category: "사내 규정",
    categoryImage: CategoryName2,
    isActive: true,
    createdAt: "2024-01-16 14:30",
  },
  {
    id: 3,
    question: "계정 비밀번호를 변경하는 방법은?",
    answer: "계정 설정에서 비밀번호 변경에 대한 안내입니다.",
    category: "근무 / 근태",
    categoryImage: CategoryName3,
    isActive: true,
    createdAt: "2024-01-16 14:30",
  },
  {
    id: 3,
    question: "계정 비밀번호를 변경하는 방법은?",
    answer: "계정 설정에서 비밀번호 변경에 대한 안내입니다.",
    category: "급여 / 복리후생",
    categoryImage: CategoryName4,
    isActive: true,
    createdAt: "2024-01-16 14:30",
  },
  {
    id: 3,
    question: "계정 비밀번호를 변경하는 방법은?",
    answer: "계정 설정에서 비밀번호 변경에 대한 안내입니다.",
    category: "복지 / 휴가",
    categoryImage: CategoryName5,
    isActive: false,
    createdAt: "2024-01-16 14:30",
  }
];

const TABLE_COLUMNS = [
  { key: "question", label: "질문" },
  { key: "answer", label: "카테고리" },
  { key: "category", label: "상태" },
  { key: "isActive", label: "최종 수정일" },
  { key: "action", label: "작업" }
];

const FAQTable = () => {
  const renderTableRow = (faq: FAQItem) => (
    <TableRow key={faq.id}>
      <TableCell isQuestion>
        <QuestionContainer>
          <QuestionText>{faq.question}</QuestionText>
          <AnswerText>{faq.answer}</AnswerText>
        </QuestionContainer>
      </TableCell>
      <TableCell isCategory>
        <CategoryImageContainer>
          <CategoryImage src={faq.categoryImage} alt={faq.category} />
        </CategoryImageContainer>
      </TableCell>
      <TableCell isStatus>
        <StatusIcon 
          src={faq.isActive ? ActiveIcon : InactiveIcon} 
          alt={faq.isActive ? "활성" : "비활성"} 
        />
      </TableCell>
      <TableCell isDate>
        <DateText>{faq.createdAt}</DateText>
      </TableCell>
      <TableCell isAction>
        <ActionContainer>
          <ActionText>수정</ActionText>
          <ActionDivider />
          <ActionText>보관</ActionText>
        </ActionContainer>
      </TableCell>
    </TableRow>
  );

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>FAQ 목록</TableTitle>
      </TableHeader>
      <HeaderBox>
        <TableHeaderRow>
          {TABLE_COLUMNS.map((column) => (
            <TableHeaderCell 
              key={column.key} 
              isQuestion={column.key === "question"}
              isCategory={column.key === "answer"}
              isStatus={column.key === "category"}
              isDate={column.key === "isActive"}
              isAction={column.key === "action"}
            >
              {column.label}
            </TableHeaderCell>
          ))}
        </TableHeaderRow>
      </HeaderBox>
      <TableBody>
        {faqData.map(renderTableRow)}
      </TableBody>
    </TableContainer>
  );
};

export default FAQTable;

// Styled Components
const TableContainer = styled.div`
  width: 1062px;
  height: 586px;
  border-radius: var(--br-18);
  background: var(--color-white);
  box-shadow: 0 6px 18px 0 rgba(125, 93, 246, 0.10);
`;

const TableHeader = styled.div`
  width: 1062px;
  height: 75px;
  border-radius: 19.5px 19.5px 0 0;
  border-bottom: 1.5px solid #E9E0F0;
  background: var(--color-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const TableTitle = styled.h2`
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 600;
  margin-left: 44px;
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 28px;
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
`;

const BaseCell = styled.div<{ 
  isQuestion?: boolean; 
  isCategory?: boolean; 
  isStatus?: boolean; 
  isDate?: boolean; 
  isAction?: boolean; 
}>`
  flex: ${({ isQuestion, isCategory, isStatus, isDate, isAction }) => {
    if (isQuestion) return 1.5;
    if (isCategory) return 0.5;
    if (isStatus) return 0.8;
    if (isDate) return 0.8;
    if (isAction) return 0.8;
    return 1;
  }};
  display: flex;
  align-items: center;
  justify-content: ${({ isCategory, isStatus }) => isCategory || isStatus ? 'center' : 'flex-start'};
  text-align: ${({ isCategory, isStatus }) => isCategory || isStatus ? 'center' : 'left'};
`;

const TableHeaderCell = styled(BaseCell)`
  color: #000;
  font-family: Pretendard;
  font-size: var(--font-size-16);
  font-weight: 500;
  padding-left: ${({ isQuestion }) => isQuestion ? '44px' : '0'};
  padding-right: ${({ isCategory }) => isCategory ? '24px' : '0'};
`;

const TableCell = styled(BaseCell)`
  padding: var(--padding-16) var(--padding-24);
  font-size: var(--font-size-14);
  color: var(--color-dimgray);
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: ${({ isQuestion }) => isQuestion ? '44px' : 'var(--padding-24)'};
  padding-right: ${({ isCategory }) => isCategory ? '24px' : 'var(--padding-24)'};
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  text-align: left;
`;

const QuestionText = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
`;

const AnswerText = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
`;

const CategoryImageContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const CategoryImage = styled.img<{ alt?: string }>`
  width: ${({ alt }) => alt?.includes('급여') ? '116.917px' : '97.5px'};
  height: 31.5px;
  object-fit: contain;
`;

const StatusIcon = styled.img<{ src: string }>`
  width: ${({ src }) => src.includes('InActive') ? '60px' : '56px'};
  height: 32px;
  object-fit: contain;
`;

const DateText = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
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

const ActionText = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: var(--color-mediumpurple-300);
  }
`;