import styled from "styled-components";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "시스템 사용 방법은 어떻게 되나요?",
    answer: "시스템 사용 방법에 대한 상세한 안내입니다.",
    category: "시스템",
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    question: "권한 설정은 어떻게 하나요?",
    answer: "권한 설정 방법에 대한 안내입니다.",
    category: "권한",
    isActive: true,
    createdAt: "2024-01-16",
  },
  {
    id: 3,
    question: "데이터 백업은 어떻게 하나요?",
    answer: "데이터 백업 방법에 대한 안내입니다.",
    category: "데이터",
    isActive: false,
    createdAt: "2024-01-17",
  }
];

const columns = [
  { key: 'question', label: '질문', width: '30%' },
  { key: 'answer', label: '답변', width: '35%' },
  { key: 'category', label: '카테고리', width: '15%' },
  { key: 'isActive', label: '상태', width: '10%' },
  { key: 'action', label: '작업', width: '10%' },
];

const FAQTable = () => {
  return (
    <TableWrapper>
      <TableBox>
        <TableHeader>
          {columns.map((col, idx) => (
            <HeaderCell
              key={col.key}
              style={{ width: col.width, marginRight: idx === 0 ? '48px' : 0 }}
            >
              {col.label}
            </HeaderCell>
          ))}
        </TableHeader>
        <Divider />
        <TableBody>
          {faqData.map((faq) => (
            <TableRow key={faq.id}>
              <BodyCell style={{ width: columns[0].width, justifyContent: 'flex-start', paddingLeft: '48px' }}>
                <QuestionText>{faq.question}</QuestionText>
              </BodyCell>
              <BodyCell style={{ width: columns[1].width, border: "none" }}>
                <AnswerText>{faq.answer}</AnswerText>
              </BodyCell>
              <BodyCell style={{ width: columns[2].width, border: "none"}}>
                <CategoryText>{faq.category}</CategoryText>
              </BodyCell>
              <BodyCell style={{ width: columns[3].width, border: "none" }}>
                <StatusText isActive={faq.isActive}>
                  {faq.isActive ? '활성' : '비활성'}
                </StatusText>
              </BodyCell>
              <BodyCell style={{ width: columns[4].width }}>
                <ActionText>수정</ActionText>
              </BodyCell>
            </TableRow>
          ))}
        </TableBody>
      </TableBox>
    </TableWrapper>
  );
};

export default FAQTable;

const TableWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 0;
`;

const TableBox = styled.div`
  width: 1052.25px;
  background: var(--color-white);
  border-radius: 17.5px;
  box-shadow: 0px 0px 10.5px 2.1px rgba(153, 102, 204, 0.05);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  width: 100%;
  padding: 24px 0 24px 0;
  background: transparent;
`;

const HeaderCell = styled.div`
  width: 100%;
  font-weight: 600;
  font-size: 16.8px;
  color: var(--color-dimgray);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Divider = styled.div`
  width: 100%;
  border-top: 0.35px solid var(--color-darkgray);
  margin-bottom: 4px;
`;

const TableBody = styled.div`
  width: 100%;
`;

const TableRow = styled.div`
  display: flex;
  width: 100%;
  min-height: 72px;
  align-items: center;
  margin-bottom: 12px;
`;

const BodyCell = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 16.8px;
  color: var(--color-black);
  height: 72px;
  gap: 10px;
`;

const ActionText = styled.span`
  color: var(--color-black);
  font-size: 16.8px;
  cursor: pointer;
  border-radius: 2.8px;
  transition: color 0.2s;
  &:hover {
    color: var(--color-mediumpurple-300);
  }
`;

const QuestionText = styled.span`
  font-size: 16.8px;
  font-weight: 600;
  color: var(--color-black);
  width: 100%;
  text-align: left;
`;

const AnswerText = styled.span`
  font-size: 16.8px;
  color: var(--color-black);
  width: 100%;
  text-align: left;
  line-height: 1.4;
`;

const CategoryText = styled.span`
  font-size: 16.8px;
  color: var(--color-black);
  width: 100%;
  text-align: center;
`;

const StatusText = styled.span<{ isActive: boolean }>`
  font-size: 16.8px;
  color: ${props => props.isActive ? '#4CAF50' : '#F44336'};
  font-weight: 500;
`;