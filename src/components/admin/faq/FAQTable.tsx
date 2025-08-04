import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import ActiveIcon from "../../../assets/common/Active.svg";
import InactiveIcon from "../../../assets/common/InActive.svg";
import CustomDropdown from "../../common/CustomDropdown";
import ConfirmModal from "../../common/ConfirmModal";
import FAQUploadModal from "./FAQUploadModal";
import { useFAQStore } from "../../../store/faqStore";
import { type FAQItem } from "../../../store/faqStore";
import type { FAQUploadData } from "./FAQUploadModal";

// Types
interface FAQTableProps {
  currentPage: number;
  itemsPerPage: number;
}

interface ConfirmModalState {
  isOpen: boolean;
  type: 'archive' | null;
  faqId: number | null;
  faqName: string;
}

interface EditModalState {
  isOpen: boolean;
  faqData: FAQUploadData | undefined;
  faqId: number | null;
}

// Constants
const INITIAL_CONFIRM_MODAL: ConfirmModalState = {
  isOpen: false,
  type: null,
  faqId: null,
  faqName: ''
};

const INITIAL_EDIT_MODAL: EditModalState = {
  isOpen: false,
  faqData: undefined,
  faqId: null
};

const FAQTable: React.FC<FAQTableProps> = ({ currentPage, itemsPerPage }) => {
  // 로컬 상태 관리
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>(INITIAL_CONFIRM_MODAL);
  const [editModal, setEditModal] = useState<EditModalState>(INITIAL_EDIT_MODAL);

  // Zustand store에서 데이터와 함수 가져오기
  const {
    selectedCategory,
    searchTerm,
    setSelectedCategory,
    setSearchTerm,
    updateFAQItem,
    archiveFAQItem,
    getFilteredData
  } = useFAQStore();

  // 페이지네이션된 데이터 가져오기
  const { paginatedData: currentFAQItems } = getFilteredData(currentPage, itemsPerPage);

  // 카테고리 옵션 설정
  const categoryOptions = useMemo(() => [
    { value: "", label: "전체 카테고리" },
    { value: "it", label: "IT/시스템" },
    { value: "policy", label: "사내 규정" },
    { value: "work", label: "근무 / 근태" },
    { value: "salary", label: "급여 / 복리후생" },
    { value: "welfare", label: "복지 / 휴가" }
  ], []);

  // 테이블 컬럼 설정
  const tableColumns = useMemo(() => [
    { key: "question", label: "질문" },
    { key: "answer", label: "카테고리" },
    { key: "category", label: "상태" },
    { key: "isActive", label: "최종 수정일" },
    { key: "action", label: "작업" }
  ], []);

  // 행 토글 핸들러
  const handleRowToggle = useCallback((id: number) => {
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

  // 수정 핸들러
  const handleEdit = useCallback((faq: FAQItem) => {
    setEditModal({
      isOpen: true,
      faqData: {
        question: faq.question,
        answer: faq.answer,
        category: faq.category
      },
      faqId: faq.id
    });
  }, []);

  // 보관 클릭 핸들러
  const handleArchiveClick = useCallback((faq: FAQItem) => {
    setConfirmModal({
      isOpen: true,
      type: 'archive',
      faqId: faq.id,
      faqName: faq.question
    });
  }, []);

  // 확인 액션 핸들러
  const handleConfirmAction = useCallback(() => {
    if (confirmModal.type === 'archive' && confirmModal.faqId) {
      archiveFAQItem(confirmModal.faqId);
    }
    setConfirmModal(INITIAL_CONFIRM_MODAL);
  }, [confirmModal, archiveFAQItem]);

  // 모달 닫기 핸들러들
  const handleCloseConfirmModal = useCallback(() => {
    setConfirmModal(INITIAL_CONFIRM_MODAL);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditModal(INITIAL_EDIT_MODAL);
  }, []);

  // 수정 제출 핸들러
  const handleSubmitEdit = useCallback((data: FAQUploadData) => {
    if (editModal.faqId) {
      updateFAQItem(editModal.faqId, data);
    }
    handleCloseEditModal();
  }, [handleCloseEditModal, editModal.faqId, updateFAQItem]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, [setSelectedCategory]);

  // 검색 핸들러
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  // 액션 버튼 렌더링
  const renderActionButtons = useCallback((faq: FAQItem) => (
    <ActionContainer>
      <ActionText 
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(faq);
        }}
      >
        수정
      </ActionText>
      <ActionDivider />
      <ActionText 
        onClick={(e) => {
          e.stopPropagation();
          handleArchiveClick(faq);
        }}
      >
        보관
      </ActionText>
    </ActionContainer>
  ), [handleEdit, handleArchiveClick]);

  // 확장된 내용 렌더링
  const renderExpandedContent = useCallback((faq: FAQItem) => (
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

  // 테이블 행 렌더링
  const renderTableRow = useCallback((faq: FAQItem) => {
    const isExpanded = expandedRows.has(faq.id);
    
    return (
      <React.Fragment key={faq.id}>
        <TableRow 
          onClick={() => handleRowToggle(faq.id)} 
          $isExpanded={isExpanded}
        >
          <TableCell>
            <QuestionText>{faq.question}</QuestionText>
          </TableCell>
          <TableCell>
            <CategoryImage src={faq.categoryImage} alt={faq.category} />
          </TableCell>
          <TableCell>
            <StatusIcon 
              src={faq.isActive ? ActiveIcon : InactiveIcon} 
              alt={faq.isActive ? "활성" : "비활성"} 
            />
          </TableCell>
          <TableCell>
            <DateText>{faq.createdAt}</DateText>
          </TableCell>
          <TableCell>
            {renderActionButtons(faq)}
          </TableCell>
        </TableRow>
        {isExpanded && renderExpandedContent(faq)}
      </React.Fragment>
    );
  }, [expandedRows, handleRowToggle, renderActionButtons, renderExpandedContent]);

  // 테이블 헤더 렌더링
  const renderTableHeader = useCallback(() => (
    <TableHeader>
      <TableTitle>FAQ 목록</TableTitle>
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="질문으로 검색"
          value={searchTerm}
          onChange={handleSearch}
        />
        <DropdownContainer>
          <CustomDropdown
            options={categoryOptions}
            value={selectedCategory}
            onChange={handleCategoryChange}
          />
        </DropdownContainer>
      </SearchContainer>
    </TableHeader>
  ), [searchTerm, selectedCategory, handleSearch, handleCategoryChange, categoryOptions]);

  // 모달 렌더링
  const renderModals = useCallback(() => (
    <>
      {confirmModal.isOpen && confirmModal.type && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmAction}
          fileName={confirmModal.faqName}
          type={confirmModal.type}
        />
      )}

      {editModal.isOpen && (
        <FAQUploadModal
          isOpen={editModal.isOpen}
          onClose={handleCloseEditModal}
          onSubmit={handleSubmitEdit}
          initialData={editModal.faqData}
          isEdit={true}
        />
      )}
    </>
  ), [confirmModal, editModal, handleCloseConfirmModal, handleConfirmAction, handleCloseEditModal, handleSubmitEdit]);

  return (
    <>
      <TableContainer>
        {renderTableHeader()}
        <TableHead>
          <TableRow>
            {tableColumns.map((column) => (
              <TableCell key={column.key}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentFAQItems.map(renderTableRow)}
        </TableBody>
      </TableContainer>
      {renderModals()}
    </>
  );
};

export default FAQTable;

const TableContainer = styled.div`
  width: 1062px;
  border-radius: var(--br-18);
  background: var(--color-white);
  box-shadow: 0 6px 18px 0 rgba(125, 93, 246, 0.10);
  transition: height 0.3s ease;
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
  padding: 0 44px;
  box-sizing: border-box;
  position: relative;
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
`;

const TableTitle = styled.h2`
  color: #000;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
`;

const QuestionText = styled.span`
  color: #000;
  font-size: 16px;
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

const TableRow = styled.div<{ $isExpanded?: boolean }>`
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
  cursor: pointer;
  padding: 30px 0;
  
  &:hover {
    background-color: rgba(153, 102, 204, 0.05);
  }
  
  ${props => props.$isExpanded && `
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
  height: 164px;
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

const ExpandedContent = styled.div`
  display: flex;
  align-items: center;
  height: 82px;
  margin-top: 4px;
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #000;
  font-size: var(--font-size-16);
  font-weight: 500;
  
  &:nth-child(1) { width: 340px; padding-left: 44px; }
  &:nth-child(2) { width: 120px; padding-left: 24px; justify-content: center; }
  &:nth-child(3) { width: 120px; padding-left: 24px; justify-content: center; }
  &:nth-child(4) { width: 200px; padding-left: 36px; }
  &:nth-child(5) { width: 150px; }
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
  right: 36px;
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