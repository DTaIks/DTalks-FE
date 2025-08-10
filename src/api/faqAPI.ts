import { apiInstance } from './apiInstance';
import type { 
  FAQListApiResponse, 
  FAQListRequest, 
  FAQSearchRequest,
  FAQFilterRequest,
  FAQCategoryApiItem
} from '@/types/faq';

// 공통 헤더
const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

// 공통 에러 처리 함수
const handleApiError = (error: unknown, defaultMessage: string): never => {
  const axiosError = error as { 
    response?: { 
      data?: { 
        message?: string; 
        error?: string; 
        code?: string;
      }; 
      status?: number;
    }; 
    message?: string 
  };
  
  const serverMsg = axiosError?.response?.data?.message || axiosError?.response?.data?.error || axiosError?.message;
  const errorCode = axiosError?.response?.data?.code;
  const statusCode = axiosError?.response?.status;
  
  // 중복 에러 처리
  if (statusCode === 409 || errorCode === 'DUPLICATE' || 
      serverMsg?.includes('중복') || serverMsg?.includes('이미 존재') ||
      serverMsg?.includes('duplicate') || serverMsg?.includes('already exists')) {
    throw new Error('동일한 질문이 이미 존재합니다. 다른 질문을 입력해주세요.');
  }
  
  // 기타 클라이언트 에러
  if (statusCode === 400) {
    throw new Error(serverMsg || '잘못된 요청입니다. 입력 정보를 확인해주세요.');
  }
  
  throw new Error(serverMsg || defaultMessage);
};

// 백엔드 응답 데이터 추출 (중첩 구조 처리)
const extractResponseData = (responseData: unknown): unknown => {
  // 백엔드가 { code, status, message, data } 형태로 응답하는 경우 data 추출
  return (responseData && typeof responseData === 'object' && 'data' in responseData) 
    ? (responseData as { data: unknown }).data 
    : responseData;
};

// FAQ 관련 API 함수들
export const faqAPI = {
  // FAQ 목록 조회
  getFAQList: async (params: FAQListRequest): Promise<FAQListApiResponse> => {
    const queryParams = new URLSearchParams();
    
    // 필수 파라미터
    queryParams.append('pageNumber', params.pageNumber.toString());
    queryParams.append('size', (params.size ?? 4).toString());
    
    // 선택적 파라미터
    if (params.sort) queryParams.append('sort', params.sort);
    
    // 기타 동적 파라미터들
    Object.entries(params).forEach(([key, value]) => {
      if (!['pageNumber', 'size', 'sort'].includes(key) && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    try {
      const response = await apiInstance.get(`/admin/faq?${queryParams.toString()}`, { headers: JSON_HEADERS });
      return extractResponseData(response.data) as FAQListApiResponse;
    } catch (error) {
      return handleApiError(error, 'FAQ 목록 조회에 실패했습니다.');
    }
  },

  // FAQ 검색
  searchFAQs: async (params: FAQSearchRequest): Promise<FAQListApiResponse> => {
    const queryParams = new URLSearchParams({
      keyword: params.keyword,
      pageNumber: params.pageNumber.toString(),
      size: (params.size ?? 4).toString()
    });

    try {
      const response = await apiInstance.get(`/admin/faq/search?${queryParams.toString()}`, { headers: JSON_HEADERS });
      return extractResponseData(response.data) as FAQListApiResponse;
    } catch (error) {
      return handleApiError(error, 'FAQ 검색에 실패했습니다.');
    }
  },

  // FAQ 추가
  createFAQ: async (faqData: { question: string; answer: string; category: string }): Promise<void> => {
    const payload = {
      question: faqData.question?.trim(),
      answer: faqData.answer?.trim(),
      category: faqData.category?.trim(),
    };

    try {
      await apiInstance.post('/admin/faq', payload, { headers: JSON_HEADERS });
    } catch (error) {
      handleApiError(error, 'FAQ 추가에 실패했습니다.');
    }
  },

  // FAQ 상세 조회
  getFAQDetail: async (faqId: number): Promise<{ faqId: number; question: string; answer: string; categoryName: string }> => {
    try {
      const response = await apiInstance.get(`/admin/faq/${faqId}`, { headers: JSON_HEADERS });
      return extractResponseData(response.data) as { faqId: number; question: string; answer: string; categoryName: string };
    } catch (error) {
      return handleApiError(error, 'FAQ 상세 정보를 불러오는데 실패했습니다.');
    }
  },

  // FAQ 수정
  updateFAQ: async (faqId: number, faqData: { question: string; answer: string; category: string }): Promise<void> => {
    const payload = {
      question: faqData.question?.trim(),
      answer: faqData.answer?.trim(),
      category: faqData.category?.trim(),
    };

    try {
      await apiInstance.put(`/admin/faq/${faqId}`, payload, { headers: JSON_HEADERS });
    } catch (error) {
      handleApiError(error, 'FAQ 수정에 실패했습니다.');
    }
  },

  // FAQ 보관
  archiveFAQ: async (faqId: number): Promise<void> => {
    try {
      await apiInstance.patch(`/admin/faq/${faqId}/archive`, undefined, { headers: JSON_HEADERS });
    } catch (error) {
      handleApiError(error, 'FAQ 보관에 실패했습니다.');
    }
  },

  // FAQ 카테고리별 필터링
  filterFAQsByCategory: async (params: FAQFilterRequest): Promise<FAQListApiResponse> => {
    const queryParams = new URLSearchParams({
      categoryName: params.categoryName,
      pageNumber: params.pageNumber.toString(),
      size: (params.size ?? 4).toString()
    });

    try {
      const response = await apiInstance.get(`/admin/faq/filter?${queryParams.toString()}`, { headers: JSON_HEADERS });
      return extractResponseData(response.data) as FAQListApiResponse;
    } catch (error) {
      return handleApiError(error, 'FAQ 카테고리 필터링에 실패했습니다.');
    }
  },

  // FAQ 카테고리 목록 조회
  getFAQCategories: async (): Promise<FAQCategoryApiItem[]> => {
    try {
      const response = await apiInstance.get('/admin/faq/category', { headers: JSON_HEADERS });
      return extractResponseData(response.data) as FAQCategoryApiItem[];
    } catch (error) {
      return handleApiError(error, 'FAQ 카테고리 목록 조회에 실패했습니다.');
    }
  },

  // FAQ 카테고리 보관
  archiveFAQCategory: async (categoryName: string): Promise<void> => {
    try {
      await apiInstance.patch(`/admin/faq/category/archive?categoryName=${encodeURIComponent(categoryName)}`, undefined, { headers: JSON_HEADERS });
    } catch (error) {
      handleApiError(error, 'FAQ 카테고리 보관에 실패했습니다.');
    }
  },

  // FAQ 카테고리 복원
  restoreFAQCategory: async (categoryName: string): Promise<void> => {
    try {
      await apiInstance.patch(`/admin/faq/category/restore?categoryName=${encodeURIComponent(categoryName)}`, undefined, { headers: JSON_HEADERS });
    } catch (error) {
      handleApiError(error, 'FAQ 카테고리 복원에 실패했습니다.');
    }
  },

};
