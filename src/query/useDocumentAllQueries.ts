import { useQuery } from '@tanstack/react-query';
import { documentAPI } from '@/api/documentAPI';

// 전체 문서 목록 조회 쿼리
export const useDocumentAllList = (currentPage: number, pageSize: number = 4) => {
  const pageNumber = currentPage - 1; // 서버 0-based 인덱스

  return useQuery({
    queryKey: ['documentAllList', pageNumber, pageSize],
    queryFn: async () => {
      const response = await documentAPI.getDocuments({ 
        pageNumber, 
        pageSize,
        categoryName: 'all'
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
