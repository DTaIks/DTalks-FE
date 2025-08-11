import { apiInstance } from './apiInstance';
import type { DocumentResponse, DocumentRequest } from '@/types/document';

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
};
