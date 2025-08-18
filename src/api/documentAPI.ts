import { apiInstance } from './apiInstance';
import type { 
  DocumentResponse, 
  DocumentRequest,
  DocumentSearchRequest,
  DocumentVersionResponse,
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

// 문서 버전 히스토리 타입
export interface DocumentVersionHistory {
  versionId: number;
  fileName: string;
  versionNumber: string;
  createdAt: string;
  description: string;
  uploaderName: string;
}

// 문서 업로드 정보 타입
interface DocumentUploadInfo {
  fileName: string;
  description: string;
  fileVersion: string;
  category: string;
}

// 문서 업로드 응답 타입
interface DocumentUploadResponse {
  fileId: number;
  fileUrl: string;
}

// 버전 비교 요청 타입
export interface DocumentVersionCompareRequest {
  fileId: number;
  oldVersionId: number;
  newVersionId: number;
}

// 버전 비교 응답 타입 
export interface DocumentVersionCompareResponse {
  originalVersion: number;
  revisedVersion: number;
  insertCount: number;
  deleteCount: number;
  diff: Array<{
    lineNumber: number;
    changeType: 'delete' | 'insert' | 'equal';
    content: string;
  }>;
}

export const documentAPI = {
  // 문서 목록 조회
  getDocuments: async (params: DocumentRequest): Promise<DocumentResponse> => {
    try {
      const { categoryName, pageNumber, pageSize = 4, status } = params;
      const queryParams = new URLSearchParams();
      
      const category = categoryName || 'all';
      queryParams.append('category', category);
      
      if (status) {
        queryParams.append('status', status);
      }
      
      if (pageNumber >= 0) {
        queryParams.append('pageNumber', pageNumber.toString());
      }
      
      // pageSize 파라미터 처리 (1-10 범위만 가능)
      const validPageSize = Math.max(1, Math.min(10, pageSize));
      queryParams.append('pageSize', validPageSize.toString());
      
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

    if (params.status) {
      queryParams.append('status', params.status);
    }

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

  // 문서 버전 비교 사항
  compareDocumentVersions: async (params: DocumentVersionCompareRequest): Promise<DocumentVersionCompareResponse> => {
    try {
      const { fileId, oldVersionId, newVersionId } = params;
      const queryParams = new URLSearchParams({
        oldVersionId: oldVersionId.toString(),
        newVersionId: newVersionId.toString()
      });
      
      const url = `/admin/file/${fileId}/compare?${queryParams.toString()}`;
      const response = await apiInstance.get(url, { headers: JSON_HEADERS });
      
      return extractResponseData(response.data) as DocumentVersionCompareResponse;
    } catch (error) {
      return handleApiError(error, '문서 버전 비교에 실패했습니다.');
    }
  },
  
  // 문서 업로드
  uploadDocument: async (file: File, fileInfo: DocumentUploadInfo): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    
    // 파일 추가
    formData.append('file', file);
    formData.append('fileInfo', JSON.stringify(fileInfo));
    
    const response = await apiInstance.post('/admin/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // 문서 수정
  updateDocument: async (fileId: number, file: File | null, fileInfo: DocumentUploadInfo): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    
    // 파일이 있는 경우에만 추가 (수정 시 파일을 변경하지 않을 수도 있음)
    if (file) {
      formData.append('file', file);
    }
    
    // fileInfo를 JSON 문자열로 변환하여 추가
    formData.append('fileInfo', JSON.stringify(fileInfo));
    
    const response = await apiInstance.post(`/admin/documents/${fileId}/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // 문서 보관
  archiveDocument: async (fileId: number): Promise<void> => {
    await apiInstance.patch(`/admin/file/${fileId}/archive`);
  },

  // 문서 복원
  restoreDocument: async (fileId: number): Promise<void> => {
    await apiInstance.patch(`/admin/file/${fileId}/restore`);
  },

  // 문서 버전 히스토리 조회
  getDocumentVersionHistory: async (fileId: number): Promise<DocumentVersionHistory[]> => {
    const response = await apiInstance.get(`/admin/file/${fileId}/history`);
    return response.data.data || response.data;
  },
};
