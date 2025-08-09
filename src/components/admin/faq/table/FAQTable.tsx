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
import { useUpdateFAQ, useArchiveFAQ } from "@/hooks/faq/useFAQMutations";
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
  // props로 받은 API 데이터 사용
  const currentFAQItems = faqItems;

  // Zustand 스토어에서 UI 상태 가져오기
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

  // React Query mutations
  const updateFAQMutation = useUpdateFAQ();
  const archiveFAQMutation = useArchiveFAQ();

  // 핸들러 함수들
  const handleRowToggle = useCallback((faqId: number) => {
    toggleExpandedRow(faqId);
  }, [toggleExpandedRow]);

  const handleEdit = useCallback(async (faq: FAQItem) => {
    try {
      // FAQ 상세 정보를 API로 조회
      const faqDetail = await faqAPI.getFAQDetail(faq.faqId);
      
      setEditModal({
        isOpen: true,
        faqData: {
          question: faqDetail.question,
          answer: faqDetail.answer || '',
          category: faqDetail.categoryName || faq.category
        },
        faqId: faq.faqId
      });
    } catch (error) {
      console.error('FAQ 상세 정보 조회 실패:', error);
      // 에러 발생 시 기본 정보로 모달 열기
      setEditModal({
        isOpen: true,
        faqData: {
          question: faq.question,
          answer: '',
          category: faq.category
        },
        faqId: faq.faqId
      });
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
    if (confirmModal.type === 'archive' && confirmModal.faqId) {
      try {
        await archiveFAQMutation.mutateAsync(confirmModal.faqId);
      } catch (error) {
        console.error('FAQ 보관 실패:', error);
      }
    }
    closeConfirmModal();
  }, [confirmModal, archiveFAQMutation, closeConfirmModal]);

  const handleSubmitEdit = useCallback(async (data: { question: string; answer: string; category: string }) => {
    if (editModal.faqId) {
      try {
        await updateFAQMutation.mutateAsync({
          faqId: editModal.faqId,
          faqData: {
            question: data.question,
            answer: data.answer,
            category: data.category
          }
        });
        closeEditModal();
      } catch (error) {
        console.error('FAQ 수정 실패:', error);
      }
    }
  }, [editModal.faqId, updateFAQMutation, closeEditModal]);

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



