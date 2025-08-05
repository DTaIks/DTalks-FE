import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import ConfirmModal from "@/components/common/ConfirmModal";
import FAQUploadModal from "@/components/admin/faq/FAQUploadModal";
import { useFAQStore } from "@/store/faqStore";
import { type FAQItem } from "@/store/faqStore";
import type { FAQTableProps } from "@/types/faq";
import FAQTableHeader from "@/components/admin/faq/table/FAQTableHeader";
import FAQTableHead from "@/components/admin/faq/table/FAQTableHead";
import FAQTableRow from "@/components/admin/faq/table/FAQTableRow";
import { useFAQTableHandlers } from "@/hooks/faq/useFAQTableHandlers";

const FAQTable: React.FC<FAQTableProps> = ({ currentPage, itemsPerPage }) => {
  // Zustand store에서 데이터와 함수 가져오기
  const {
    selectedCategory,
    searchTerm,
    getFilteredData
  } = useFAQStore();

  // 페이지네이션된 데이터 가져오기
  const { paginatedData: currentFAQItems } = getFilteredData(currentPage, itemsPerPage);

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
    handleSubmitEdit,
    handleCategoryChange,
    handleSearch
  } = useFAQTableHandlers();

  // 카테고리 옵션 설정
  const categoryOptions = useMemo(() => [
    { value: "", label: "전체 카테고리" },
    { value: "it", label: "IT/시스템" },
    { value: "policy", label: "사내 규정" },
    { value: "work", label: "근무 / 근태" },
    { value: "salary", label: "급여 / 복리후생" },
    { value: "welfare", label: "복지 / 휴가" }
  ], []);

  // 테이블 행 렌더링
  const renderTableRow = useCallback((faq: FAQItem) => {
    const isExpanded = expandedRows.has(faq.id);
    
    return (
      <FAQTableRow
        key={faq.id}
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

  return (
    <>
      <TableContainer>
        <FAQTableHeader
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          categoryOptions={categoryOptions}
        />
        <FAQTableHead />
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

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
`;