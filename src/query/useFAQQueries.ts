import { useQuery } from '@tanstack/react-query';
import { faqAPI } from '@/api/faqAPI';
import { transformFAQApiItems, transformFAQCategoryApiItems } from '@/utils/faqUtils';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import type { FAQListApiResponse, FAQListResponse } from '@/types/faq';

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
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 30, // 30분
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: (previousData: FAQListResponse | undefined) => previousData,
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
  return useQuery<{ faqId: number; question: string; answer: string; categoryName: string }>({
    queryKey: ['faqDetail', faqId],
    queryFn: async () => {
      if (!faqId) throw new Error('FAQ ID가 필요합니다.');
      
      const result = await faqAPI.getFAQDetail(faqId);
      
      // 중첩된 응답 구조 처리: { code, status, message, data: {...} }
      const actualData = result && typeof result === 'object' && 'data' in result 
        ? (result as { data: unknown }).data 
        : result;
      
      return actualData as { faqId: number; question: string; answer: string; categoryName: string };
    },
    enabled: enabled && !!faqId,
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });
};

// FAQ 카테고리 목록 조회 쿼리
export const useFAQCategories = () => {
  return useQuery({
    queryKey: ['faqCategories'],
    queryFn: async () => {
      const categories = await faqAPI.getFAQCategories();
      return transformFAQCategoryApiItems(categories);
    },
    staleTime: 1000 * 60 * 10, // 10분 (카테고리는 자주 변경되지 않으므로)
    refetchOnWindowFocus: false,
  });
};