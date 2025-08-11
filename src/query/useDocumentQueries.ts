import { useQuery } from '@tanstack/react-query';
import { documentAPI } from '@/api/documentAPI';

// 카테고리별 문서 목록 조회 쿼리
export const useDocumentList = (currentPage: number, category: 'policy' | 'glossary' | 'reportform', pageSize: number = 4) => {
  const pageNumber = currentPage - 1; // 서버 0-based 인덱스

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
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지
    gcTime: 1000 * 60 * 30, // 30분간 캐시 보관
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 안함
    refetchOnMount: false, // 컴포넌트 마운트 시 재요청 안함
  });
};

export const useRecentUpdateCountByCategory = (categoryName: string) => {
  return useQuery({
    queryKey: ['recentUpdateCount', categoryName],
    queryFn: () => documentAPI.getRecentUpdateCountByCategory(categoryName),
    enabled: !!categoryName,
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지
    gcTime: 1000 * 60 * 30, // 30분간 캐시 보관
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 안함
    refetchOnMount: false, // 컴포넌트 마운트 시 재요청 안함
  });
};

export const useActiveDocumentCountByCategory = (categoryName: string) => {
  return useQuery({
    queryKey: ['activeDocumentCount', categoryName],
    queryFn: () => documentAPI.getActiveDocumentCountByCategory(categoryName),
    enabled: !!categoryName,
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지
    gcTime: 1000 * 60 * 30, // 30분간 캐시 보관
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 안함
    refetchOnMount: false, // 컴포넌트 마운트 시 재요청 안함
  });
};
