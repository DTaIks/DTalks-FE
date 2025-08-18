import React, { useCallback } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import FAQCategoryTable from "@/components/admin/faq/category/FAQCategoryTable";
import { useFAQCategories } from "@/query/useFAQQueries";
import { useArchiveFAQCategory, useRestoreFAQCategory } from "@/query/useFAQMutations";
import { useFAQStore } from "@/store/faqStore";
import type { FAQCategory } from "@/types/faq";

const FAQCategoryPage = () => {
  useScrollToTop();
  
  const { data: categoryData = [], isLoading, error } = useFAQCategories();
  const archiveCategoryMutation = useArchiveFAQCategory();
  const restoreCategoryMutation = useRestoreFAQCategory();
  
  const {
    categoryConfirmModal,
    setCategoryConfirmModal,
    closeCategoryConfirmModal
  } = useFAQStore();

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

  return (
    <Container>
      <HeaderWrapper>
        <TitleContainer title="FAQ 카테고리 관리" subtitle="FAQ 카테고리를 관리하세요" />
      </HeaderWrapper>
      <FAQCategoryTable 
        categoryData={categoryData}
        isLoading={isLoading}
        error={error}
        onArchiveClick={handleArchiveClick}
        onConfirmAction={handleConfirmAction}
        isMutationPending={archiveCategoryMutation.isPending || restoreCategoryMutation.isPending}
      />
    </Container>
  );
};

export default FAQCategoryPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  position: relative;
  width: 1056px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 32px;
`; 