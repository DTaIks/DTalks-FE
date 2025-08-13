import { apiInstance } from './apiInstance';
import type { 
  DocumentResponse, 
  DocumentRequest,
  DocumentSearchRequest,
  DocumentVersionResponse,
  VersionDiff
} from '@/types/document';

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
  const statusCode = axiosError?.response?.status;
  
  if (statusCode === 400) {
    throw new Error(serverMsg || '잘못된 요청입니다. 입력 정보를 확인해주세요.');
  }
  
  throw new Error(serverMsg || defaultMessage);
};

const extractResponseData = (responseData: unknown): unknown => {
  return (responseData && typeof responseData === 'object' && 'data' in responseData) 
    ? (responseData as { data: unknown }).data 
    : responseData;
};

export const documentAPI = {
  // 문서 목록 조회 
  getDocuments: async (params: DocumentRequest): Promise<DocumentResponse> => {
    try {
      const { categoryName, pageNumber, pageSize = 4 } = params;
      const queryParams = new URLSearchParams();
      
      const category = categoryName || 'all';
      queryParams.append('category', category);
      
      if (pageNumber >= 0) {
        queryParams.append('pageNumber', pageNumber.toString());
      }
      
      if (pageSize >= 1 && pageSize <= 10) {
        queryParams.append('pageSize', pageSize.toString());
      }
      
      const url = `/admin/documents?${queryParams.toString()}`;
      const response = await apiInstance.get(url, { headers: JSON_HEADERS });
      
      return extractResponseData(response.data) as DocumentResponse;
    } catch (error) {
      return handleApiError(error, '문서 목록 조회에 실패했습니다.');
    }
  },

  // 문서 검색
  searchDocuments: async (params: DocumentSearchRequest): Promise<DocumentResponse> => {
    const queryParams = new URLSearchParams({
      category: params.category,
      fileName: params.fileName,
      pageNumber: params.pageNumber.toString(),
      pageSize: (params.pageSize ?? 4).toString()
    });

    try {
      const response = await apiInstance.get(`/admin/documents/search?${queryParams.toString()}`, { headers: JSON_HEADERS });
      return extractResponseData(response.data) as DocumentResponse;
    } catch (error) {
      return handleApiError(error, '사내 문서 검색에 실패했습니다.');
    }
  },
  
  // 카테고리별 문서 수 조회
  getDocumentCountByCategory: async (categoryName: string): Promise<{ documentCount: number }> => {
    try {
      const response = await apiInstance.get(`/admin/documents/count?category=${encodeURIComponent(categoryName)}`, { headers: JSON_HEADERS });
      return extractResponseData(response.data) as { documentCount: number };
    } catch (error) {
      return handleApiError(error, '문서 수 조회에 실패했습니다.');
    }
  },
  
  // 최근 업데이트 문서 수 조회
  getRecentUpdateCountByCategory: async (categoryName: string): Promise<{ documentCount: number }> => {
    try {
      const response = await apiInstance.get(`/admin/documents/recent-update-count?category=${encodeURIComponent(categoryName)}`, { headers: JSON_HEADERS });
      return extractResponseData(response.data) as { documentCount: number };
    } catch (error) {
      return handleApiError(error, '최근 업데이트 문서 수 조회에 실패했습니다.');
    }
  },
  
  // 활성 문서 수 조회
  getActiveDocumentCountByCategory: async (categoryName: string): Promise<{ documentCount: number }> => {
    try {
      const response = await apiInstance.get(`/admin/documents/count/active?category=${encodeURIComponent(categoryName)}`, { headers: JSON_HEADERS });
      return extractResponseData(response.data) as { documentCount: number };
    } catch (error) {
      return handleApiError(error, '활성 문서 수 조회에 실패했습니다.');
    }
  },

  // 문서 버전 목록 조회
  getDocumentVersions: async (category: string, fileName: string): Promise<DocumentVersionResponse> => {
    try {
      // URL 파라미터 인코딩 적용
      const encodedCategory = encodeURIComponent(category);
      const encodedFileName = encodeURIComponent(fileName);
      
      const url = `/admin/documents/version?category=${encodedCategory}&fileName=${encodedFileName}`;
      const response = await apiInstance.get(url, { headers: JSON_HEADERS });
      
      return extractResponseData(response.data) as DocumentVersionResponse;
    } catch (error) {
      return handleApiError(error, '문서 버전 목록 조회에 실패했습니다.');
    }
  },

  // 문서명으로 문서 검색 (버전 조회용)
  searchDocumentsByName: async (category: string, fileName: string): Promise<DocumentVersionResponse> => {
    try {
      const queryParams = new URLSearchParams({
        category: category,
        fileName: fileName
      });
      
      const url = `/admin/documents/version?${queryParams.toString()}`;
      const response = await apiInstance.get(url, { headers: JSON_HEADERS });
      
      return extractResponseData(response.data) as DocumentVersionResponse;
    } catch (error) {
      return handleApiError(error, '문서명으로 검색에 실패했습니다.');
    }
  },





  // 버전 비교 API
compareVersions: async (
  fileId: number,
  oldVersionId: number,
  newVersionId: number
): Promise<VersionDiff> => {
  try {
    const url = `/admin/file/${fileId}/compare?oldVersionId=${oldVersionId}&newVersionId=${newVersionId}`;
    const response = await apiInstance.get(url, { headers: JSON_HEADERS });
    return extractResponseData(response.data) as VersionDiff;
  } catch (error) {
    return handleApiError(error, '버전 비교에 실패했습니다.');
  }
},

  
};
