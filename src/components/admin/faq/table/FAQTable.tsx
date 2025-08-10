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
import { useFAQStore } from "@/store/faqStore";
import { useUpdateFAQ, useArchiveFAQ } from "@/query/useFAQMutations";
import { faqAPI } from "@/api/faqAPI";

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
  const {
    expandedRows,
    confirmModal,
    editModal,
    toggleExpandedRow,
    setConfirmModal,
    setEditModal,
    closeConfirmModal,
    closeEditModal
  } = useFAQStore();

  const updateFAQMutation = useUpdateFAQ();
  const archiveFAQMutation = useArchiveFAQ();

  const handleRowToggle = useCallback((faqId: number) => {
    toggleExpandedRow(faqId);
  }, [toggleExpandedRow]);

  const handleEdit = useCallback(async (faq: FAQItem) => {
    // 비활성화된 FAQ는 수정할 수 없음
    if (!faq.isActive) {
      console.warn('보관된 FAQ는 수정할 수 없습니다.');
      return;
    }

    const createModalData = (question: string, answer: string, category: string) => ({
      isOpen: true,
      faqData: { question, answer, category },
      faqId: faq.faqId
    });

    try {
      const faqDetail = await faqAPI.getFAQDetail(faq.faqId);
      setEditModal(createModalData(
        faqDetail.question,
        faqDetail.answer || '',
        faqDetail.categoryName || faq.category
      ));
    } catch (error) {
      console.error('FAQ 상세 정보 조회 실패:', error);
      setEditModal(createModalData(faq.question, '', faq.category));
    }
  }, [setEditModal]);

  const handleArchiveClick = useCallback((faq: FAQItem) => {
    setConfirmModal({
      isOpen: true,
      type: 'archive',
      faqId: faq.faqId,
      faqName: faq.question,
      categoryId: null,
      categoryName: ''
    });
  }, [setConfirmModal]);

  const handleConfirmAction = useCallback(async () => {
    if (confirmModal.type !== 'archive' || !confirmModal.faqId) return;
    
    try {
      await archiveFAQMutation.mutateAsync(confirmModal.faqId);
    } catch (error) {
      console.error('FAQ 보관 실패:', error);
    } finally {
      closeConfirmModal();
    }
  }, [confirmModal, archiveFAQMutation, closeConfirmModal]);

  const handleSubmitEdit = useCallback(async (data: { question: string; answer: string; category: string }) => {
    if (!editModal.faqId) return;
    
    try {
      await updateFAQMutation.mutateAsync({
        faqId: editModal.faqId,
        faqData: data
      });
      closeEditModal();
    } catch (error) {
      console.error('FAQ 수정 실패:', error);
    }
  }, [editModal.faqId, updateFAQMutation, closeEditModal]);

  const categoryOptions = useMemo(() => [
    { value: "", label: "전체 카테고리" },
    { value: "it", label: "IT / 시스템" },
    { value: "policy", label: "사내 규정" },
    { value: "work", label: "근무 / 근태" },
    { value: "salary", label: "급여 / 복리후생" },
    { value: "welfare", label: "복지 / 휴가" }
  ], []);

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

  const renderModals = useCallback(() => (
    <>
      {confirmModal.isOpen && confirmModal.type && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={closeConfirmModal}
          onConfirm={handleConfirmAction}
          fileName={confirmModal.faqName}
          type={confirmModal.type}
          isLoading={archiveFAQMutation.isPending}
        />
      )}

      {editModal.isOpen && (
        <FAQUploadModal
          isOpen={editModal.isOpen}
          onClose={closeEditModal}
          onSubmit={handleSubmitEdit}
          initialData={editModal.faqData}
          isEdit={true}
          isSubmitting={updateFAQMutation.isPending}
        />
      )}
    </>
  ), [confirmModal, editModal, closeConfirmModal, handleConfirmAction, closeEditModal, handleSubmitEdit, archiveFAQMutation.isPending, updateFAQMutation.isPending]);

  const renderHeader = () => (
    <FAQTableHeader
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      onSearch={onSearch}
      onCategoryChange={onCategoryChange}
      categoryOptions={categoryOptions}
    />
  );

  const renderEmptyState = () => {
    if (isLoading) {
      const loadingMessage = isSearchMode ? "검색 중입니다..." : "FAQ 목록을 불러오고 있습니다...";
      return <EmptyState message={loadingMessage} subMessage="잠시만 기다려주세요." />;
    }
    if (error) {
      return <EmptyState message="FAQ 목록을 불러오는데 실패했습니다." />;
    }
    if (faqItems.length === 0) {
      return <EmptyState message={isSearchMode ? "검색 결과가 없습니다." : "등록된 FAQ가 없습니다."} />;
    }
    return null;
  };

  const emptyState = renderEmptyState();
  if (emptyState) {
    return (
      <TableContainer>
        {renderHeader()}
        {emptyState}
      </TableContainer>
    );
  }

  return (
    <>
      <TableContainer>
        {renderHeader()}
        <FAQTableHead />
        <TableBody>
          {faqItems.map(renderTableRow)}
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