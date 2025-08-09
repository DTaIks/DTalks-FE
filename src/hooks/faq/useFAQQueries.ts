import { useQuery } from '@tanstack/react-query';
import { faqAPI } from '@/api/faqAPI';
import { transformFAQApiItems } from '@/utils/faqUtils';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';

// FAQ 목록 조회 쿼리 (페이지는 0부터 시작)
export const useFAQList = (currentPage: number) => {
  const pageNumber = currentPage - 1; // 서버 0-based 인덱스

  return useQuery({
    queryKey: ['faqList', pageNumber],
    queryFn: async () => {
      const response = await faqAPI.getFAQList({ pageNumber, size: 4 });
      return {
        ...response,
        content: transformFAQApiItems(response.content || []),
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0,
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// FAQ 검색 쿼리 (페이지는 0부터 시작, 디바운스 적용)
export const useFAQSearch = (keyword: string, currentPage: number, enabled: boolean = true) => {
  const { debouncedValue: debouncedKeyword, isDebouncing } = useDebouncedSearch(keyword, 500);
  const pageNumber = currentPage - 1; // 서버 0-based 인덱스

  const queryResult = useQuery({
    queryKey: ['faqSearch', debouncedKeyword, pageNumber],
    queryFn: async () => {
      const response = await faqAPI.searchFAQs({
        keyword: debouncedKeyword,
        pageNumber,
        size: 4,
      });
      return {
        ...response,
        content: transformFAQApiItems(response.content || []),
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0,
      };
    },
    enabled: enabled && debouncedKeyword.trim().length > 0 && !isDebouncing,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    isDebouncing, // 디바운싱 상태 추가로 반환
  };
};

// FAQ 카테고리별 필터링 쿼리
export const useFAQFilter = (categoryName: string, currentPage: number, enabled: boolean = true) => {
  const pageNumber = currentPage - 1; // 서버 0-based 인덱스

  return useQuery({
    queryKey: ['faqFilter', categoryName, pageNumber],
    queryFn: async () => {
      const response = await faqAPI.filterFAQsByCategory({
        categoryName,
        pageNumber,
        size: 4,
      });
      return {
        ...response,
        content: transformFAQApiItems(response.content || []),
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0,
      };
    },
    enabled: enabled && categoryName.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });
};

// FAQ 상세 조회 쿼리
export const useFAQDetail = (faqId: number | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['faqDetail', faqId],
    queryFn: async () => {
      if (!faqId) throw new Error('FAQ ID가 필요합니다.');
      
      const result = await faqAPI.getFAQDetail(faqId);
      
      // 중첩된 응답 구조 처리: { code, status, message, data: {...} }
      const actualData = result && (result as any).data ? (result as any).data : result;
      
      return actualData;
    },
    enabled: enabled && !!faqId,
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });
};


