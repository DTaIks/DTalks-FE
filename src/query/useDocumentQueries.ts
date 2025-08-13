import { useQuery } from '@tanstack/react-query';
import { documentAPI } from '@/api/documentAPI';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import type { DocumentInfo, DocumentPagingInfo } from '@/types/document';

const filterDocumentsByStatus = (documents: DocumentInfo[], status: string): DocumentInfo[] => {
  if (status === '전체 상태') {
    return documents;
  }
  
  const isActiveFilter = status === '활성';
  return documents.filter(doc => doc.isActive === isActiveFilter);
};

// 카테고리별 문서 목록 조회 쿼리
export const useDocumentList = (
  currentPage: number, 
  category: 'policy' | 'glossary' | 'reportform', 
  pageSize: number = 4
) => {
  const pageNumber = currentPage - 1;

  return useQuery({
    queryKey: ['documentList', category, pageNumber, pageSize],
    queryFn: async () => {
      const response = await documentAPI.getDocuments({
        pageNumber,
        pageSize,
        categoryName: category
      });
      return {
        ...response,
        content: response.documentInfoResponseList || [],
        totalPages: response.pagingInfo?.totalPageCount || 0,
        totalElements: response.pagingInfo?.elementCount || 0,
      };
    },
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 30, // 30분
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: (previousData: { content: DocumentInfo[]; totalPages: number; totalElements: number; documentInfoResponseList: DocumentInfo[]; pagingInfo: DocumentPagingInfo; } | undefined) => previousData,
  });
};

// 카테고리별 문서 검색 쿼리 
export const useDocumentSearchByCategory = (
  category: 'policy' | 'glossary' | 'reportform',
  fileName: string,
  currentPage: number,
  enabled: boolean = true,
  pageSize: number = 4,
  status: string = '전체 상태'
) => {
  const { debouncedValue: debouncedFileName, isDebouncing } = useDebouncedSearch(fileName, 500);
  const pageNumber = currentPage - 1;

  const queryResult = useQuery({
    queryKey: ['documentSearchByCategory', category, debouncedFileName, pageNumber, status],
    queryFn: async () => {
      const response = await documentAPI.searchDocuments({
        category: category,
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
    enabled: enabled && debouncedFileName.trim().length > 0 && !isDebouncing,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    isDebouncing,
  };
};

// 카테고리별 문서 상태 필터링 쿼리
export const useDocumentFilterByCategory = (
  category: 'policy' | 'glossary' | 'reportform',
  currentPage: number,
  enabled: boolean = true,
  pageSize: number = 4,
  status: string = '전체 상태'
) => {
  const pageNumber = currentPage - 1;

  return useQuery({
    queryKey: ['documentFilterByCategory', category, pageNumber, pageSize, status],
    queryFn: async () => {
      const response = await documentAPI.getDocuments({
        categoryName: category,
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

// 카테고리별 문서 수 조회
export const useDocumentCountByCategory = (categoryName: string) => {
  return useQuery({
    queryKey: ['documentCount', categoryName],
    queryFn: () => documentAPI.getDocumentCountByCategory(categoryName),
    enabled: !!categoryName,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useRecentUpdateCountByCategory = (categoryName: string) => {
  return useQuery({
    queryKey: ['recentUpdateCount', categoryName],
    queryFn: () => documentAPI.getRecentUpdateCountByCategory(categoryName),
    enabled: !!categoryName,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useActiveDocumentCountByCategory = (categoryName: string) => {
  return useQuery({
    queryKey: ['activeDocumentCount', categoryName],
    queryFn: () => documentAPI.getActiveDocumentCountByCategory(categoryName),
    enabled: !!categoryName,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// 문서 버전 목록 조회 훅
export const useDocumentVersions = (
  category: string, 
  fileName: string, 
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['documentVersions', category, fileName],
    queryFn: async () => {
      const response = await documentAPI.getDocumentVersions(category, fileName);
      return {
        ...response,
        versions: response.documents?.[0]?.versions || [],
        documentInfo: response.documents?.[0] || null,
      };
    },
    enabled: enabled && !!category && !!fileName,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,  
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (failureCount: number, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 404) {
        return false;
      }
      return failureCount < 2; 
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// 문서명으로 문서 검색 훅 
export const useSearchDocumentsByName = (
  category: string,
  fileName: string,
  enabled: boolean = true
) => {
  const { debouncedValue: debouncedFileName, isDebouncing } = useDebouncedSearch(fileName, 300);

  const queryResult = useQuery({
    queryKey: ['searchDocumentsByName', category, debouncedFileName],
    queryFn: async () => {
      const response = await documentAPI.searchDocumentsByName(category, debouncedFileName);
      return {
        ...response,
        documents: response.documents || [],
      };
    },
    enabled: enabled && !!category && debouncedFileName.trim().length > 0 && !isDebouncing,
    staleTime: 1000 * 60 * 2, 
    refetchOnWindowFocus: false,
    retry: (failureCount: number, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });

  return {
    ...queryResult,
    isDebouncing,
  };
};
// 문서 버전 히스토리 조회
export const useDocumentVersionHistory = (fileId: number | null) => {
  return useQuery({
    queryKey: ['documentVersionHistory', fileId],
    queryFn: () => documentAPI.getDocumentVersionHistory(fileId!),
    enabled: !!fileId,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    gcTime: 1000 * 60 * 15, // 15분간 캐시 보관
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
