import React, { useCallback } from "react";
import styled from "styled-components";
import ConfirmModal from "@/components/common/ConfirmModal";
import EmptyState from "@/components/common/EmptyState";
import type { FAQCategory } from "@/types/faq";
import FAQCategoryTableHeader from "@/components/admin/faq/category/FAQCategoryTableHeader";
import FAQCategoryTableHead from "@/components/admin/faq/category/FAQCategoryTableHead";
import FAQCategoryTableRow from "@/components/admin/faq/category/FAQCategoryTableRow";
import { useFAQCategories } from "@/query/useFAQQueries";
import { useArchiveFAQCategory, useRestoreFAQCategory } from "@/query/useFAQMutations";
import { useFAQStore } from "@/store/faqStore";

const FAQCategoryTable: React.FC = () => {
  const { data: categoryData = [], isLoading, error } = useFAQCategories();
  const archiveCategoryMutation = useArchiveFAQCategory();
  const restoreCategoryMutation = useRestoreFAQCategory();
  
  const {
    selectedCategoryItem,
    categoryConfirmModal,
    setSelectedCategoryItem,
    setCategoryConfirmModal,
    closeCategoryConfirmModal
  } = useFAQStore();

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
    if (!categoryConfirmModal.categoryName) return;
    
    try {
      const mutation = categoryConfirmModal.type === 'archive' 
        ? archiveCategoryMutation 
        : restoreCategoryMutation;
      
      await mutation.mutateAsync(categoryConfirmModal.categoryName);
    } catch (error) {
      console.error('카테고리 보관/복원 실패:', error);
    } finally {
      closeCategoryConfirmModal();
    }
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

  const renderEmptyState = () => {
    if (isLoading) {
      return <EmptyState message="카테고리 목록을 불러오고 있습니다..." subMessage="잠시만 기다려주세요." />;
    }
    if (error) {
      return <EmptyState message="카테고리 목록을 불러오는데 실패했습니다." subMessage="잠시 후 다시 시도해주세요." />;
    }
    if (categoryData.length === 0) {
      return <EmptyState message="등록된 카테고리가 없습니다." subMessage="새로운 카테고리를 추가해보세요." />;
    }
    return null;
  };

  const emptyState = renderEmptyState();
  if (emptyState) {
    return (
      <TableContainer>
        <FAQCategoryTableHeader />
        {emptyState}
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
