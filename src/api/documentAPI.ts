import { apiInstance } from './apiInstance';
import type { DocumentResponse, DocumentRequest } from '@/types/document';

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

export const documentAPI = {
  // 문서 목록 조회 (카테고리별 또는 전체)
  getDocuments: async (params: DocumentRequest): Promise<DocumentResponse> => {
    const { categoryName, pageNumber, pageSize = 4 } = params;
    const queryParams = new URLSearchParams();
    
    // 카테고리 필터 (all, policy, glossary, reportform)
    const category = categoryName || 'all';
    queryParams.append('category', category);
    
    // 페이지 번호 (0부터 시작, 0 이상만 가능)
    if (pageNumber >= 0) {
      queryParams.append('pageNumber', pageNumber.toString());
    }
    
    // 페이지 사이즈 (1부터 10까지 가능)
    if (pageSize >= 1 && pageSize <= 10) {
      queryParams.append('pageSize', pageSize.toString());
    }
    
    const url = `/admin/documents?${queryParams.toString()}`;
    
    const response = await apiInstance.get(url);
    
    // 서버 응답이 {code, status, message, data} 형태인 경우 data 필드를 반환
    return response.data.data || response.data;
  },

  // 카테고리별 문서 수 조회
  getDocumentCountByCategory: async (categoryName: string): Promise<{ documentCount: number }> => {
    const response = await apiInstance.get(`/admin/documents/count?category=${encodeURIComponent(categoryName)}`);
    return response.data.data || response.data;
  },

  // 최근 업데이트 문서 수 조회
  getRecentUpdateCountByCategory: async (categoryName: string): Promise<{ documentCount: number }> => {
    const response = await apiInstance.get(`/admin/documents/recent-update-count?category=${encodeURIComponent(categoryName)}`);
    return response.data.data || response.data;
  },

  // 활성 문서 수 조회
  getActiveDocumentCountByCategory: async (categoryName: string): Promise<{ documentCount: number }> => {
    const response = await apiInstance.get(`/admin/documents/count/active?category=${encodeURIComponent(categoryName)}`);
    return response.data.data || response.data;
  },

  // 문서 업로드
  uploadDocument: async (file: File, fileInfo: DocumentUploadInfo): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    
    // 파일 추가
    formData.append('file', file);
    // fileInfo를 JSON 문자열로 변환하여 추가 (미디어 API와 동일한 방식)
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
