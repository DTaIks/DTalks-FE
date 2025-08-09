import React, { useCallback } from "react";
import styled from "styled-components";
import ConfirmModal from "@/components/common/ConfirmModal";
import EmptyState from "@/components/common/EmptyState";
import type { FAQCategory } from "@/types/faq";
import FAQCategoryTableHeader from "@/components/admin/faq/category/FAQCategoryTableHeader";
import FAQCategoryTableHead from "@/components/admin/faq/category/FAQCategoryTableHead";
import FAQCategoryTableRow from "@/components/admin/faq/category/FAQCategoryTableRow";
import { useFAQCategories } from "@/hooks/faq/useFAQQueries";
import { useArchiveFAQCategory, useRestoreFAQCategory } from "@/hooks/faq/useFAQMutations";
import { useFAQStore } from "@/store/faqStore";

const FAQCategoryTable: React.FC = () => {
  // API에서 카테고리 데이터 조회 (React Query)
  const { data: categoryData = [], isLoading, error } = useFAQCategories();
  
  // 카테고리 아카이브/복원 mutations
  const archiveCategoryMutation = useArchiveFAQCategory();
  const restoreCategoryMutation = useRestoreFAQCategory();
  
  // Zustand 스토어에서 UI 상태 가져오기
  const {
    selectedCategoryItem,
    categoryConfirmModal,
    setSelectedCategoryItem,
    setCategoryConfirmModal,
    closeCategoryConfirmModal
  } = useFAQStore();

  // 핸들러 함수들
  const handleRowClick = useCallback((category: FAQCategory) => {
    setSelectedCategoryItem(category);
  }, [setSelectedCategoryItem]);

  const handleArchiveClick = useCallback((category: FAQCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategoryConfirmModal({
      isOpen: true,
      type: category.isActive ? 'archive' : 'restore',
      categoryId: category.categoryId,
      categoryName: category.categoryName
    });
  }, [setCategoryConfirmModal]);

  const handleConfirmAction = useCallback(async () => {
    if (categoryConfirmModal.categoryName) {
      try {
        if (categoryConfirmModal.type === 'archive') {
          await archiveCategoryMutation.mutateAsync(categoryConfirmModal.categoryName);
        } else if (categoryConfirmModal.type === 'restore') {
          await restoreCategoryMutation.mutateAsync(categoryConfirmModal.categoryName);
        }
      } catch (error) {
        console.error('카테고리 보관/복원 실패:', error);
      }
    }
    closeCategoryConfirmModal();
  }, [categoryConfirmModal, archiveCategoryMutation, restoreCategoryMutation, closeCategoryConfirmModal]);

  const renderTableRow = useCallback((category: FAQCategory) => (
    <FAQCategoryTableRow
      key={category.categoryId}
      category={category}
      isSelected={selectedCategoryItem?.categoryId === category.categoryId}
      onRowClick={handleRowClick}
      onArchiveClick={handleArchiveClick}
    />
  ), [selectedCategoryItem, handleRowClick, handleArchiveClick]);

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <TableContainer>
        <FAQCategoryTableHeader />
        <EmptyState 
          message="카테고리 목록을 불러오고 있습니다..."
          subMessage="잠시만 기다려주세요."
        />
      </TableContainer>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <TableContainer>
        <FAQCategoryTableHeader />
        <EmptyState 
          message="카테고리 목록을 불러오는데 실패했습니다."
          subMessage="잠시 후 다시 시도해주세요."
        />
      </TableContainer>
    );
  }

  // 빈 상태 처리
  if (categoryData.length === 0) {
    return (
      <TableContainer>
        <FAQCategoryTableHeader />
        <EmptyState 
          message="등록된 카테고리가 없습니다."
          subMessage="새로운 카테고리를 추가해보세요."
        />
      </TableContainer>
    );
  }

  return (
    <>
      <TableContainer>
        <FAQCategoryTableHeader />
        <Table>
          <FAQCategoryTableHead />
          <TableBody>
            {categoryData.map(renderTableRow)}
          </TableBody>
        </Table>
      </TableContainer>

      {categoryConfirmModal.isOpen && categoryConfirmModal.type && (
        <ConfirmModal
          isOpen={categoryConfirmModal.isOpen}
          onClose={closeCategoryConfirmModal}
          onConfirm={handleConfirmAction}
          fileName={categoryConfirmModal.categoryName}
          type={categoryConfirmModal.type as 'archive' | 'download' | 'restore'}
          isLoading={archiveCategoryMutation.isPending || restoreCategoryMutation.isPending}
        />
      )}
    </>
  );
};

export default FAQCategoryTable;

const TableContainer = styled.div`
  width: 1062px;
  height: 586px;
  border-radius: var(--br-18);
  background: var(--color-white);
  box-shadow: 0 6px 18px 0 rgba(125, 93, 246, 0.10);
  overflow: hidden;
`;

const Table = styled.div`
  width: 100%;
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 56px;
  padding-top: 28px;
`;
