import { useQuery } from '@tanstack/react-query';
import { documentAPI } from '@/api/documentAPI';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import type { DocumentInfo } from '@/types/document';

// 카테고리 매핑 함수
const mapCategoryForAPI = (uiCategory: string): string => {
  switch (uiCategory) {
    case '전체 카테고리':
    case '전체':
      return 'all';
    case '사내 정책':
      return 'policy';
    case '용어 사전':
      return 'glossary';
    case '보고서 양식':
      return 'reportform';
    default:
      return 'all';
  }
};

const filterDocumentsByStatus = (documents: DocumentInfo[], status: string): DocumentInfo[] => {
  if (status === '전체 상태') {
    return documents;
  }
  
  const isActiveFilter = status === '활성';
  return documents.filter(doc => doc.isActive === isActiveFilter);
};

// 전체 문서 목록 조회 쿼리
export const useDocumentAllList = (
  currentPage: number, 
  pageSize: number = 4, 
  status: string = '전체 상태'
) => {
  const pageNumber = currentPage - 1; // 서버 0-based 인덱스

  return useQuery({
    queryKey: ['documentAllList', pageNumber, pageSize, status],
    queryFn: async () => {
      const response = await documentAPI.getDocuments({
        pageNumber,
        pageSize,
        categoryName: 'all'
      });

      const allDocuments = response.documentInfoResponseList || [];
      const filteredDocuments = filterDocumentsByStatus(allDocuments, status);

      return {
        ...response,
        content: filteredDocuments,
        totalPages: response.pagingInfo?.totalPageCount || 0,
        totalElements: response.pagingInfo?.elementCount || 0,
        filteredCount: filteredDocuments.length,
        originalCount: allDocuments.length,
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// 문서 검색 쿼리
export const useDocumentSearch = (
  category: string,
  fileName: string,
  currentPage: number,
  enabled: boolean = true,
  pageSize: number = 4,
  status: string = '전체 상태'
) => {
  const { debouncedValue: debouncedFileName, isDebouncing } = useDebouncedSearch(fileName, 500);
  const pageNumber = currentPage - 1; // 서버 0-based 인덱스

  const mappedCategory = mapCategoryForAPI(category);

  const queryResult = useQuery({
    queryKey: ['documentSearch', mappedCategory, debouncedFileName, pageNumber, status],
    queryFn: async () => {
      const response = await documentAPI.searchDocuments({
        category: mappedCategory,
        fileName: debouncedFileName,
        pageNumber,
        pageSize,
      });

      const allDocuments = response.documentInfoResponseList || [];
      const filteredDocuments = filterDocumentsByStatus(allDocuments, status);

      return {
        ...response,
        content: filteredDocuments,
        totalPages: response.pagingInfo?.totalPageCount || 0,
        totalElements: response.pagingInfo?.elementCount || 0,
        filteredCount: filteredDocuments.length,
        originalCount: allDocuments.length,
      };
    },
    // 파일명이 있을 때만 검색 실행
    enabled: enabled && debouncedFileName.trim().length > 0 && !isDebouncing,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    isDebouncing, // 디바운싱 상태 추가로 반환
  };
};

// 문서 카테고리별 필터링 쿼리
export const useDocumentFilter = (
  categoryName: string,
  currentPage: number,
  enabled: boolean = true,
  pageSize: number = 4,
  status: string = '전체 상태'
) => {
  const pageNumber = currentPage - 1; // 서버 0-based 인덱스

  const mappedCategory = mapCategoryForAPI(categoryName);

  return useQuery({
    queryKey: ['documentFilter', mappedCategory, pageNumber, pageSize, status],
    queryFn: async () => {
      const response = await documentAPI.getDocuments({
        categoryName: mappedCategory,
        pageNumber,
        pageSize,
      });

      const allDocuments = response.documentInfoResponseList || [];
      const filteredDocuments = filterDocumentsByStatus(allDocuments, status);

      return {
        ...response,
        content: filteredDocuments,
        totalPages: response.pagingInfo?.totalPageCount || 0,
        totalElements: response.pagingInfo?.elementCount || 0,
        filteredCount: filteredDocuments.length,
        originalCount: allDocuments.length,
      };
    },
    enabled: enabled && (mappedCategory !== 'all' || status !== '전체 상태'),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// 상태별 문서 필터링만을 위한 쿼리
export const useDocumentStatusFilter = (
  status: string,
  currentPage: number,
  enabled: boolean = true,
  pageSize: number = 4
) => {
  const pageNumber = currentPage - 1; // 서버 0-based 인덱스

  return useQuery({
    queryKey: ['documentStatusFilter', status, pageNumber, pageSize],
    queryFn: async () => {
      const response = await documentAPI.getDocuments({
        categoryName: 'all',
        pageNumber,
        pageSize,
      });

      const allDocuments = response.documentInfoResponseList || [];
      const filteredDocuments = filterDocumentsByStatus(allDocuments, status);

      return {
        ...response,
        content: filteredDocuments,
        totalPages: response.pagingInfo?.totalPageCount || 0,
        totalElements: response.pagingInfo?.elementCount || 0,
        filteredCount: filteredDocuments.length,
        originalCount: allDocuments.length,
      };
    },
    enabled: enabled && status !== '전체 상태',
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};