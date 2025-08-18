import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import FAQCategoryTable from "@/components/admin/faq/category/FAQCategoryTable";
import ErrorModal from "@/components/common/ErrorModal";
import { useFAQCategories } from "@/query/useFAQQueries";
import { useArchiveFAQCategory, useRestoreFAQCategory } from "@/query/useFAQMutations";
import { useFAQStore } from "@/store/faqStore";
import { authAPI } from "@/api/authAPI";
import type { FAQCategory } from "@/types/faq";

const FAQCategoryPage = () => {
  useScrollToTop();
  
  // 권한 관련 상태
  const [userRole, setUserRole] = useState<string>('사용자');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 프로필 정보 조회
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await authAPI.getProfile();
        setUserRole(profileData.role);
      } catch (error) {
        console.error('프로필 조회 실패:', error);
      }
    };

    fetchUserProfile();
  }, []);
  
  const { data: categoryData = [], isLoading, error } = useFAQCategories();
  const archiveCategoryMutation = useArchiveFAQCategory();
  const restoreCategoryMutation = useRestoreFAQCategory();
  
  const {
    categoryConfirmModal,
    setCategoryConfirmModal,
    closeCategoryConfirmModal
  } = useFAQStore();

  // 권한 확인 함수
  const checkUserPermission = useCallback((): boolean => {
    if (!userRole || userRole === '사용자') {
      setErrorMessage('접근 권한이 없습니다.');
      setIsErrorModalOpen(true);
      return false;
    }
    return true;
  }, [userRole]);

  const handleArchiveClick = useCallback((category: FAQCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!checkUserPermission()) return;
    
    setCategoryConfirmModal({
      isOpen: true,
      type: category.isActive ? 'archive' : 'restore',
      categoryId: category.categoryId,
      categoryName: category.categoryName
    });
  }, [setCategoryConfirmModal, checkUserPermission]);

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
      
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        errorMessage={errorMessage}
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