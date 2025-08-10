import { useMemo } from 'react';
import { useDocumentList } from '@/query/useDocumentQueries';
import { useDocumentPageStore } from '@/store/documentPageStore';

export const useDocument = (category: 'policy' | 'glossary' | 'reportform') => {
  // Zustand store에서 UI 상태 가져오기
  const {
    currentPage,
    selectedCategory,
    confirmModal,
    versionModal,
    setCurrentPage,
    setSelectedCategory,
    openConfirmModal,
    closeConfirmModal,
    openVersionModal,
    closeVersionModal,
  } = useDocumentPageStore();

  // React Query로 서버 상태 관리 (카테고리별 문서용)
  const { data: documentData, isLoading, error } = useDocumentList(currentPage, category);

  // 문서 목록
  const documents = useMemo(() => {
    if (!documentData?.documentInfoResponseList) {
      return [];
    }
    return documentData.documentInfoResponseList;
  }, [documentData]);

  // 페이지네이션 정보
  const totalPages = useMemo(() => {
    if (!documentData?.pagingInfo) {
      return 1;
    }
    const pages = documentData.pagingInfo.totalPageCount || 1;
    return pages;
  }, [documentData]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return {
    // 상태
    currentPage,
    selectedCategory,
    confirmModal,
    versionModal,
    documents,
    totalPages,
    isLoading,
    error,

    // 액션
    setCurrentPage,
    setSelectedCategory,
    openConfirmModal,
    closeConfirmModal,
    openVersionModal,
    closeVersionModal,
    handlePageChange,
    handleCategoryChange,
  };
};
