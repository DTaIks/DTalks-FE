import { apiInstance } from './apiInstance';
import type { 
  FAQListApiResponse, 
  FAQListRequest, 
  FAQSearchRequest,
  FAQFilterRequest 
} from '@/types/faq';

// FAQ 관련 API 함수들
export const faqAPI = {
  // FAQ 목록 조회
  getFAQList: async (params: FAQListRequest): Promise<FAQListApiResponse> => {
    const queryParams = new URLSearchParams();
    
    // 필수 파라미터
    queryParams.append('pageNumber', params.pageNumber.toString());
    
    // 페이지 크기: 기본 4
    const pageSize = params.size !== undefined ? params.size : 4;
    queryParams.append('size', pageSize.toString());
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }
    
    // 기타 동적 파라미터들
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'pageNumber' && key !== 'size' && key !== 'sort' && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    try {
      const response = await apiInstance.get(
        `/admin/faq?${queryParams.toString()}`,
        {
          headers: { 
            'Content-Type': 'application/json', 
            Accept: 'application/json' 
          }
        }
      );
      // 백엔드 응답이 { code, status, message, data } 형태인 경우를 처리
      const payload = (response.data && (response.data as any).data) ? (response.data as any).data : response.data;
      
      // 서버 응답 구조 정규화
      const normalizedResponse = {
        content: payload?.content || [],
        totalPages: payload?.totalPages || 0,
        totalElements: payload?.totalElements || 0,
        pageable: payload?.pageable || {},
        last: payload?.last || false,
        first: payload?.first || true,
        size: payload?.size || 0,
        number: payload?.number || 0,
        numberOfElements: payload?.numberOfElements || 0,
        empty: payload?.empty || true,
        sort: payload?.sort || { sorted: false, unsorted: true, empty: true }
      };
      
      return normalizedResponse;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
      const serverMsg = axiosError?.response?.data?.message || axiosError?.response?.data?.error || axiosError?.message;
      throw new Error(serverMsg || 'FAQ 목록 조회에 실패했습니다.');
    }
  },

  // FAQ 검색
  searchFAQs: async (params: FAQSearchRequest): Promise<FAQListApiResponse> => {
    const queryParams = new URLSearchParams();
    
    // 필수 파라미터
    queryParams.append('keyword', params.keyword);
    queryParams.append('pageNumber', params.pageNumber.toString());
    
    // 선택적 파라미터
    if (params.size !== undefined) {
      queryParams.append('size', params.size.toString());
    } else {
      queryParams.append('size', '4'); // 기본값 4
    }

    try {
      const response = await apiInstance.get(
        `/admin/faq/search?${queryParams.toString()}`,
        {
          headers: { 
            'Content-Type': 'application/json', 
            Accept: 'application/json' 
          }
        }
      );
      // 백엔드 응답이 { code, status, message, data } 형태인 경우를 처리
      const payload = (response.data && (response.data as any).data) ? (response.data as any).data : response.data;
      
      // 서버 응답 구조 정규화
      const normalizedResponse = {
        content: payload?.content || [],
        totalPages: payload?.totalPages || 0,
        totalElements: payload?.totalElements || 0,
        pageable: payload?.pageable || {},
        last: payload?.last || false,
        first: payload?.first || true,
        size: payload?.size || 0,
        number: payload?.number || 0,
        numberOfElements: payload?.numberOfElements || 0,
        empty: payload?.empty || true,
        sort: payload?.sort || { sorted: false, unsorted: true, empty: true }
      };
      
      return normalizedResponse;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
      const serverMsg = axiosError?.response?.data?.message || axiosError?.response?.data?.error || axiosError?.message;
      throw new Error(serverMsg || 'FAQ 검색에 실패했습니다.');
    }
  },

  // FAQ 추가
  createFAQ: async (faqData: { question: string; answer: string; category: string }): Promise<void> => {
    try {
      const payload = {
        question: faqData.question?.trim(),
        answer: faqData.answer?.trim(),
        category: faqData.category?.trim(),
      };
      await apiInstance.post(
        '/admin/faq',
        payload,
        {
          headers: { 
            'Content-Type': 'application/json', 
            Accept: 'application/json' 
          }
        }
      );
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
      const serverMsg = axiosError?.response?.data?.message || axiosError?.response?.data?.error || axiosError?.message;
      throw new Error(serverMsg || 'FAQ 추가에 실패했습니다.');
    }
  },

  // FAQ 상세 조회
  getFAQDetail: async (faqId: number): Promise<{ faqId: number; question: string; answer: string; categoryName: string }> => {
    try {
      const response = await apiInstance.get(`/admin/faq/${faqId}`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      
      // 백엔드 응답이 { code, status, message, data } 형태인 경우를 처리
      const payload = (response.data && (response.data as any).data) ? (response.data as any).data : response.data;
      
      return payload;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
      const serverMsg = axiosError?.response?.data?.message || axiosError?.response?.data?.error || axiosError?.message;
      throw new Error(serverMsg || 'FAQ 상세 정보를 불러오는데 실패했습니다.');
    }
  },

  // FAQ 카테고리별 필터링
  filterFAQsByCategory: async (params: FAQFilterRequest): Promise<FAQListApiResponse> => {
    const queryParams = new URLSearchParams();
    
    // 필수 파라미터
    queryParams.append('categoryName', params.categoryName);
    queryParams.append('pageNumber', params.pageNumber.toString());
    
    // 선택적 파라미터
    if (params.size !== undefined) {
      queryParams.append('size', params.size.toString());
    } else {
      queryParams.append('size', '4'); // 기본값 4
    }

    try {
      const response = await apiInstance.get(
        `/admin/faq/filter?${queryParams.toString()}`,
        {
          headers: { 
            'Content-Type': 'application/json', 
            Accept: 'application/json' 
          }
        }
      );
      
      // 백엔드 응답이 { code, status, message, data } 형태인 경우를 처리
      const payload = (response.data && (response.data as any).data) ? (response.data as any).data : response.data;
      
      // 서버 응답 구조 정규화
      const normalizedResponse = {
        content: payload?.content || [],
        totalPages: payload?.totalPages || 0,
        totalElements: payload?.totalElements || 0,
        pageable: payload?.pageable || {},
        last: payload?.last || false,
        first: payload?.first || true,
        size: payload?.size || 0,
        number: payload?.number || 0,
        numberOfElements: payload?.numberOfElements || 0,
        empty: payload?.empty || true,
        sort: payload?.sort || { sorted: false, unsorted: true, empty: true }
      };
      
      return normalizedResponse;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
      const serverMsg = axiosError?.response?.data?.message || axiosError?.response?.data?.error || axiosError?.message;
      throw new Error(serverMsg || 'FAQ 카테고리 필터링에 실패했습니다.');
    }
  },

};
