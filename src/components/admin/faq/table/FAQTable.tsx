import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import ConfirmModal from "@/components/common/ConfirmModal";
import FAQUploadModal from "@/components/admin/faq/FAQUploadModal";
import EmptyState from "@/components/common/EmptyState";
import { type FAQItem } from "@/types/faq";
import type { FAQTableProps } from "@/types/faq";
import FAQTableHeader from "@/components/admin/faq/table/FAQTableHeader";
import FAQTableHead from "@/components/admin/faq/table/FAQTableHead";
import FAQTableRow from "@/components/admin/faq/table/FAQTableRow";
import { useFAQTableHandlers } from "@/hooks/faq/useFAQTableHandlers";

const FAQTable: React.FC<FAQTableProps> = ({ 
  faqItems = [], 
  isLoading = false, 
  error,
  isSearchMode = false,
  searchTerm = "",
  selectedCategory = "",
  onSearch = () => {},
  onCategoryChange = () => {}
}) => {
  // props로 받은 API 데이터 사용
  const currentFAQItems = faqItems;

  // 핸들러 훅 사용
  const {
    expandedRows,
    confirmModal,
    editModal,
    handleRowToggle,
    handleEdit,
    handleArchiveClick,
    handleConfirmAction,
    handleCloseConfirmModal,
    handleCloseEditModal,
    handleSubmitEdit
  } = useFAQTableHandlers();

  // 카테고리 옵션 설정
  const categoryOptions = useMemo(() => [
    { value: "", label: "전체 카테고리" },
    { value: "it", label: "IT / 시스템" },
    { value: "policy", label: "사내 규정" },
    { value: "work", label: "근무 / 근태" },
    { value: "salary", label: "급여 / 복리후생" },
    { value: "welfare", label: "복지 / 휴가" }
  ], []);

  // 테이블 행 렌더링
  const renderTableRow = useCallback((faq: FAQItem) => {
    const isExpanded = expandedRows.has(faq.faqId);
    
    return (
      <FAQTableRow
        key={faq.faqId}
        faq={faq}
        isExpanded={isExpanded}
        onRowToggle={handleRowToggle}
        onEdit={handleEdit}
        onArchiveClick={handleArchiveClick}
      />
    );
  }, [expandedRows, handleRowToggle, handleEdit, handleArchiveClick]);



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

  // 로딩 상태 처리
  if (isLoading) {
    const loadingMessage = isSearchMode ? "검색 중입니다..." : "FAQ 목록을 불러오고 있습니다...";
    
    return (
      <TableContainer>
        <FAQTableHeader
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearch={onSearch}
          onCategoryChange={onCategoryChange}
          categoryOptions={categoryOptions}
        />
        <EmptyState 
          message={loadingMessage}
          subMessage="잠시만 기다려주세요."
        />
      </TableContainer>
    );
  }

  // 에러 상태 처리 (네트워크 오류, 서버 오류 등)
  if (error) {
    return (
      <TableContainer>
        <FAQTableHeader
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearch={onSearch}
          onCategoryChange={onCategoryChange}
          categoryOptions={categoryOptions}
        />
        <EmptyState 
          message="FAQ 목록을 불러오는데 실패했습니다." 
        />
      </TableContainer>
    );
  }

  return (
    <>
      <TableContainer>
        <FAQTableHeader
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearch={onSearch}
          onCategoryChange={onCategoryChange}
          categoryOptions={categoryOptions}
        />
        {currentFAQItems.length > 0 ? (
          <>
            <FAQTableHead />
            <TableBody>
              {currentFAQItems.map(renderTableRow)}
            </TableBody>
          </>
        ) : (
          <EmptyState 
            message={isSearchMode ? "검색 결과가 없습니다." : "등록된 FAQ가 없습니다."} 
          />
        )}
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

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
`;



