import { useState, useMemo, useEffect, useRef } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { useDocumentStore } from "@/store/documentStore";
import { useDocumentAllList, useDocumentSearch, useDocumentFilter } from "@/query/useDocumentAllQueries";

// 데이터 관리 훅
export const useDocumentAllData = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // 상태 변경 추적을 위한 ref들
  const prevStatusRef = useRef<string>('');
  const prevCategoryRef = useRef<string>('');
  const prevSearchTermRef = useRef<string>('');
  
  // 전역 상태
  const { 
    searchTerm, 
    selectedCategory, 
    selectedStatus,
    setSearchTerm, 
    setSelectedCategory,
    setSelectedStatus 
  } = useDocumentStore();

  // 데이터 모드 결정
  const dataMode = useMemo(() => {
    const hasSearchTerm = searchTerm.trim().length > 0;
    const hasSpecificCategory = selectedCategory !== '전체 카테고리';
    const hasSpecificStatus = selectedStatus !== '전체 상태';
    
    if (hasSearchTerm) return 'search';
    if (hasSpecificCategory && hasSpecificStatus) return 'categoryAndStatus';
    if (hasSpecificCategory) return 'category';
    if (hasSpecificStatus) return 'status';
    return 'list';
  }, [searchTerm, selectedCategory, selectedStatus]);

  const isSearchMode = dataMode === 'search';

  // 쿼리들
  const { data: documentListData, isLoading: isListLoading, error: listError } = useDocumentAllList(
    currentPage, 
    4, 
    selectedStatus
  );
  
  const { 
    data: documentSearchData, 
    isLoading: isSearchLoading, 
    error: searchError, 
    isDebouncing,
    refetch: refetchSearch
  } = useDocumentSearch(
    selectedCategory === '전체 카테고리' ? 'all' : selectedCategory,
    searchTerm,
    currentPage,
    isSearchMode,
    4,
    selectedStatus,
    refreshKey
  );

  const { data: documentCategoryFilterData, isLoading: isCategoryFilterLoading, error: categoryFilterError } = useDocumentFilter(
    selectedCategory,
    currentPage,
    dataMode === 'category',
    4,
    selectedStatus
  );

  const { data: documentCombinedFilterData, isLoading: isCombinedFilterLoading, error: combinedFilterError } = useDocumentFilter(
    selectedCategory,
    currentPage,
    dataMode === 'categoryAndStatus',
    4,
    selectedStatus
  );

  const { data: documentStatusFilterData, isLoading: isStatusFilterLoading, error: statusFilterError } = useDocumentAllList(
    currentPage,
    4,
    selectedStatus
  );

  // 상태 변경 감지 및 리페치
  useEffect(() => {
    const statusChanged = prevStatusRef.current !== selectedStatus && prevStatusRef.current !== '';
    const categoryChanged = prevCategoryRef.current !== selectedCategory && prevCategoryRef.current !== '';
    const searchChanged = prevSearchTermRef.current !== searchTerm && prevSearchTermRef.current !== '';
    
    if (statusChanged || categoryChanged || searchChanged) {    
      if (isSearchMode) {
        const timeoutId = setTimeout(() => {
          refetchSearch();
        }, 200);
        
        return () => clearTimeout(timeoutId);
      }
    }
    
    prevStatusRef.current = selectedStatus;
    prevCategoryRef.current = selectedCategory;
    prevSearchTermRef.current = searchTerm;
  }, [selectedStatus, selectedCategory, searchTerm, isSearchMode, refetchSearch]);

  // 현재 사용할 데이터 결정
  const { currentResponse, currentLoading, currentError } = useMemo(() => {
    switch (dataMode) {
      case 'search':
        return {
          currentResponse: documentSearchData,
          currentLoading: isSearchLoading || isDebouncing,
          currentError: searchError
        };
      case 'category':
        return {
          currentResponse: documentCategoryFilterData,
          currentLoading: isCategoryFilterLoading,
          currentError: categoryFilterError
        };
      case 'status':
        return {
          currentResponse: documentStatusFilterData,
          currentLoading: isStatusFilterLoading,
          currentError: statusFilterError
        };
      case 'categoryAndStatus':
        return {
          currentResponse: documentCombinedFilterData,
          currentLoading: isCombinedFilterLoading,
          currentError: combinedFilterError
        };
      default:
        return {
          currentResponse: documentListData,
          currentLoading: isListLoading,
          currentError: listError
        };
    }
  }, [
    dataMode, 
    documentSearchData, isSearchLoading, isDebouncing, searchError,
    documentCategoryFilterData, isCategoryFilterLoading, categoryFilterError,
    documentStatusFilterData, isStatusFilterLoading, statusFilterError,
    documentCombinedFilterData, isCombinedFilterLoading, combinedFilterError,
    documentListData, isListLoading, listError
  ]);

  // 문서 목록과 총 페이지 수 추출
  const { documents, totalPages } = useMemo(() => {
    const items = currentResponse?.content || [];
    const pages = currentResponse?.totalPages || 1;
    return { documents: items, totalPages: pages };
  }, [currentResponse]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);

  return {
    // 상태
    currentPage,
    setCurrentPage,
    refreshKey,
    setRefreshKey,
    
    // 데이터
    documents,
    totalPages,
    currentLoading,
    currentError,
    dataMode,
    isSearchMode,
    
    // 전역 상태
    searchTerm,
    selectedCategory,
    selectedStatus,
    setSearchTerm,
    setSelectedCategory,
    setSelectedStatus,
    
    // 유틸리티
    queryClient,
  };
};
