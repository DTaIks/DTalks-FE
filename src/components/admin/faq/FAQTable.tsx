import React, { useState, useCallback } from "react";
import styled from "styled-components";
import CategoryName1 from "../../../assets/faq/CategoryName1.svg";
import CategoryName2 from "../../../assets/faq/CategoryName2.svg";
import CategoryName3 from "../../../assets/faq/CategoryName3.svg";
import CategoryName4 from "../../../assets/faq/CategoryName4.svg";
import CategoryName5 from "../../../assets/faq/CategoryName5.svg";
import ActiveIcon from "../../../assets/common/Active.svg";
import InactiveIcon from "../../../assets/common/InActive.svg";
import CustomDropdown from "../../common/CustomDropdown";

// 타입 정의
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  categoryImage: string;
  isActive: boolean;
  createdAt: string;
}

interface TableColumn {
  key: string;
  label: string;
  width: string;
}

interface CategoryOption {
  value: string;
  label: string;
}

interface FAQTableProps {
  currentPage: number;
  itemsPerPage: number;
}

// 상수 데이터
const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "계정 비밀번호를 변경하는 방법은? 계정 비밀번호를 변경하는 방법은?",
    answer: "회사 메일 포털 → [설정] → [비밀번호 변경] 메뉴에서 직접 변경 가능합니다. 보안을 위해 3개월마다 비밀번호 변경을 권장합니다.",
    category: "IT/시스템",
    categoryImage: CategoryName1,
    isActive: true,
    createdAt: "2024-01-16 14:30",
  },
  {
    id: 2,
    question: "계정 비밀번호를 변경하는 방법은?",
    answer: "회사 메일 포털 → [설정] → [비밀번호 변경] 메뉴에서 직접 변경 가능합니다. 보안을 위해 3개월마다 비밀번호 변경을 권장합니다.",
    category: "사내 규정",
    categoryImage: CategoryName2,
    isActive: true,
    createdAt: "2024-01-16 14:30",
  },
  {
    id: 3,
    question: "계정 비밀번호를 변경하는 방법은?",
    answer: "회사 메일 포털 → [설정] → [비밀번호 변경] 메뉴에서 직접 변경 가능합니다. 보안을 위해 3개월마다 비밀번호 변경을 권장합니다.",
    category: "근무 / 근태",
    categoryImage: CategoryName3,
    isActive: true,
    createdAt: "2024-01-16 14:30",
  },
  {
    id: 4,
    question: "계정 비밀번호를 변경하는 방법은?",
    answer: "회사 메일 포털 → [설정] → [비밀번호 변경] 메뉴에서 직접 변경 가능합니다. 보안을 위해 3개월마다 비밀번호 변경을 권장합니다.",
    category: "급여 / 복리후생",
    categoryImage: CategoryName4,
    isActive: true,
    createdAt: "2024-01-16 14:30",
  },
  {
    id: 5,
    question: "계정 비밀번호를 변경하는 방법은?",
    answer: "회사 메일 포털 → [설정] → [비밀번호 변경] 메뉴에서 직접 변경 가능합니다. 보안을 위해 3개월마다 비밀번호 변경을 권장합니다.",
    category: "복지 / 휴가",
    categoryImage: CategoryName5,
    isActive: false,
    createdAt: "2024-01-16 14:30",
  },
  {
    id: 6,
    question: "회사 복지 혜택은 어떻게 확인하나요?",
    answer: "사내 포털 → [복지] → [복지 혜택] 메뉴에서 모든 복지 혜택을 확인할 수 있습니다. 각 부서별로 다른 혜택이 제공될 수 있으니 참고하세요.",
    category: "복지 / 휴가",
    categoryImage: CategoryName5,
    isActive: true,
    createdAt: "2024-01-17 09:15",
  },
  {
    id: 7,
    question: "연차 신청은 언제까지 해야 하나요?",
    answer: "연차 신청은 사용일 기준 최소 3일 전까지 신청해야 합니다. 긴급한 경우에는 팀장 승인 후 사용 가능합니다.",
    category: "근무 / 근태",
    categoryImage: CategoryName3,
    isActive: true,
    createdAt: "2024-01-17 10:30",
  },
  {
    id: 8,
    question: "급여 지급일은 언제인가요?",
    answer: "급여는 매월 25일에 지급됩니다. 공휴일인 경우 전 영업일에 지급됩니다.",
    category: "급여 / 복리후생",
    categoryImage: CategoryName4,
    isActive: true,
    createdAt: "2024-01-18 11:45",
  }
];

const TABLE_COLUMNS: TableColumn[] = [
  { key: "question", label: "질문", width: "340px" },
  { key: "answer", label: "카테고리", width: "120px" },
  { key: "category", label: "상태", width: "120px" },
  { key: "isActive", label: "최종 수정일", width: "200px" },
  { key: "action", label: "작업", width: "150px" }
];

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: "", label: "전체 카테고리" },
  { value: "it", label: "IT/시스템" },
  { value: "policy", label: "사내 규정" },
  { value: "work", label: "근무 / 근태" },
  { value: "salary", label: "급여 / 복리후생" },
  { value: "welfare", label: "복지 / 휴가" }
];

// 메인 컴포넌트
const FAQTable: React.FC<FAQTableProps> = ({ currentPage, itemsPerPage }) => {
  // 상태 관리
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [faqItems, setFaqItems] = useState<FAQItem[]>(FAQ_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // 현재 페이지의 FAQ 항목들 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFAQItems = faqItems.slice(startIndex, endIndex);

  // 이벤트 핸들러
  const handleRowToggle = useCallback((id: number): void => {
    setExpandedRows(prev => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(id)) {
        newExpandedRows.delete(id);
      } else {
        newExpandedRows.add(id);
      }
      return newExpandedRows;
    });
  }, []);

  const handleArchive = useCallback((id: number): void => {
    setFaqItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, isActive: false } : item
      )
    );
  }, []);

  const handleEdit = useCallback((id: number): void => {
    console.log('Edit FAQ:', id);
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log('Search:', e.target.value);
  }, []);

  const handleCategoryChange = useCallback((value: string): void => {
    setSelectedCategory(value);
    console.log('Category:', value);
  }, []);

  // 렌더링 함수들
  const renderActionButtons = useCallback((faq: FAQItem): JSX.Element => (
    <ActionContainer>
      <ActionText 
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(faq.id);
        }}
      >
        수정
      </ActionText>
      <ActionDivider />
      <ActionText 
        onClick={(e) => {
          e.stopPropagation();
          handleArchive(faq.id);
        }}
      >
        보관
      </ActionText>
    </ActionContainer>
  ), [handleEdit, handleArchive]);

  const renderExpandedContent = useCallback((faq: FAQItem): JSX.Element => (
    <ExpandedRow>
      <ExpandedBox>
        <ExpandedHeader>
          <ExpandedTitle>답변 내용</ExpandedTitle>
        </ExpandedHeader>
        <ExpandedContent>
          <ExpandedAnswer>{faq.answer}</ExpandedAnswer>
        </ExpandedContent>
      </ExpandedBox>
    </ExpandedRow>
  ), []);

  const renderTableRow = useCallback((faq: FAQItem): JSX.Element => {
    const isExpanded = expandedRows.has(faq.id);
    
    return (
      <React.Fragment key={faq.id}>
        <TableRow 
          onClick={() => handleRowToggle(faq.id)} 
          isExpanded={isExpanded}
        >
          <QuestionCell>
            <QuestionText>{faq.question}</QuestionText>
          </QuestionCell>
          <CategoryCell>
            <CategoryImage src={faq.categoryImage} alt={faq.category} />
          </CategoryCell>
          <StatusCell>
            <StatusIcon 
              src={faq.isActive ? ActiveIcon : InactiveIcon} 
              alt={faq.isActive ? "활성" : "비활성"} 
            />
          </StatusCell>
          <DateCell>
            <DateText>{faq.createdAt}</DateText>
          </DateCell>
          <ActionCell>
            {renderActionButtons(faq)}
          </ActionCell>
        </TableRow>
        {isExpanded && renderExpandedContent(faq)}
      </React.Fragment>
    );
  }, [expandedRows, handleRowToggle, renderActionButtons, renderExpandedContent]);

  const renderTableHeader = useCallback((): JSX.Element => (
    <TableHeader>
      <TableTitle>FAQ 목록</TableTitle>
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="질문으로 검색"
          onChange={handleSearch}
        />
        <DropdownContainer>
          <CustomDropdown
            options={CATEGORY_OPTIONS}
            value={selectedCategory}
            onChange={handleCategoryChange}
          />
        </DropdownContainer>
      </SearchContainer>
    </TableHeader>
  ), [selectedCategory, handleSearch, handleCategoryChange]);

  const renderColumnHeaders = useCallback((): JSX.Element => (
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
  ), []);

  return (
    <TableContainer>
      {renderTableHeader()}
      {renderColumnHeaders()}
      <TableBody>
        {currentFAQItems.map(renderTableRow)}
      </TableBody>
    </TableContainer>
  );
};

export default FAQTable;

const TableContainer = styled.div`
  width: 1062px;
  min-height: 600px;
  border-radius: var(--br-18);
  background: var(--color-white);
  box-shadow: 0 6px 18px 0 rgba(125, 93, 246, 0.10);
  transition: height 0.3s ease;
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
  padding: 0 44px;
  box-sizing: border-box;
  position: relative;
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

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const TableTitle = styled.h2`
  color: #000;
  font-size: 20px;
  font-weight: 600;
  flex-shrink: 0;
`;

const QuestionText = styled.span`
  color: #000;
  font-size: 18px;
  font-weight: 600;
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

const ExpandedTitle = styled.h3`
  color: #000;
  font-size: var(--font-size-20);
  font-weight: 600;
  margin-left: 36px;
`;

const ExpandedAnswer = styled.p`
  color: #333;
  font-size: var(--font-size-15);
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  margin-left: 36px;
  margin-top: 24px;
`;

const TableRow = styled.div<{ isExpanded?: boolean }>`
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
  cursor: pointer;
  padding: 30px 0;
  
  &:hover {
    background-color: rgba(153, 102, 204, 0.05);
  }
  
  ${props => props.isExpanded && `
    background-color: rgba(153, 102, 204, 0.05);
    border-bottom: none;
  `}
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
  height: 142px;
  flex-shrink: 0;
  border-radius: 18.75px;
  background: #FFF;
  margin-top: 28px;
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

const ExpandedContent = styled.div``;

const TableHeaderCell = styled.div<{ width: string }>`
  width: ${props => props.width};
  color: #000;
  font-size: var(--font-size-16);
  font-weight: 500;
  padding-left: ${({ width }) => {
    if (width === "340px") return '44px';
    if (width === "120px") return '24px';
    if (width === "200px") return '36px';
    return '0';
  }};
  display: flex;
  align-items: center;
  justify-content: ${({ width }) => {
    if (width === "120px") return 'center';
    if (width === "150px") return 'flex-start';
    return 'flex-start';
  }};
`;

const QuestionCell = styled.div`
  width: 340px;
  padding-left: 44px;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const CategoryCell = styled.div`
  width: 120px;
  display: flex;
  padding-left: 24px;
  align-items: center;
  justify-content: center;
`;

const StatusCell = styled.div`
  width: 120px;
  display: flex;
  align-items: center;
  padding-left: 24px;
  justify-content: center;
`;

const DateCell = styled.div`
  width: 200px;
  display: flex;
  padding-left: 36px;
  align-items: center;
`;

const ActionCell = styled.div`
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  position: absolute;
  right: 48px;
`;

const DropdownContainer = styled.div`
  margin-left: 12px;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  width: 160px;
  height: 33.75px;
  flex-shrink: 0;
  border-radius: 3.75px;
  border: 0.75px solid #CCC;
  padding: 0 12px;

  font-size: 14px;
  color: #000;
  background: #FFF;
  outline: none;
  box-sizing: border-box;
  
  &::placeholder {
    color: #999;
  }
`;