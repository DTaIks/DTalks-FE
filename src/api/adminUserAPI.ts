import { apiInstance } from './apiInstance';
import type { 
  AdminUserListRequest, 
  AdminUserListResponse,
  AdminUserSearchRequest,
  AdminUserSearchResponse
} from '@/types/user';

export const adminUserAPI = {
  // 사용자 목록 조회
  getAdminUserList: async (params: AdminUserListRequest): Promise<AdminUserListResponse> => {
    const apiPageNumber = params.pageNumber - 1;
    
    const queryParams = new URLSearchParams({
      pageNumber: apiPageNumber.toString(),
      pageSize: (params.pageSize || 7).toString(),
    });

    console.log('사용자 목록 조회 요청:', `/admin/user?${queryParams.toString()}`);

    try {
      const response = await apiInstance.get<AdminUserListResponse>(
        `/admin/user?${queryParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      );

      console.log('사용자 목록 조회 성공:', response.data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string; error?: string }
        };
        message?: string
      };
      
      const status = axiosError?.response?.status;
      const serverMsg = axiosError?.response?.data?.message ||
                        axiosError?.response?.data?.error ||
                        axiosError?.message;
      
      console.error('사용자 목록 조회 실패:', {
        message: serverMsg,
        status,
        response: axiosError?.response?.data,
        params: queryParams.toString()
      });

      throw new Error(serverMsg || '사용자 목록 조회에 실패했습니다.');
    }
  },

  // 사용자 검색 
  searchAdminUsers: async (params: AdminUserSearchRequest): Promise<AdminUserSearchResponse> => {
    const apiPageNumber = params.pageNumber - 1;
    
    const queryParams = new URLSearchParams({
      name: params.name,
      pageNumber: apiPageNumber.toString(), 
      pageSize: (params.pageSize || 7).toString(),
    });

    console.log('🔍 사용자 검색 요청:', `/admin/user/search?${queryParams.toString()}`);

    try {
      const response = await apiInstance.get<AdminUserSearchResponse>(
        `/admin/user/search?${queryParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      );

      console.log('사용자 검색 성공:', response.data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string; error?: string }
        };
        message?: string
      };
      
      const status = axiosError?.response?.status;
      const serverMsg = axiosError?.response?.data?.message ||
                        axiosError?.response?.data?.error ||
                        axiosError?.message;
      
      console.error('사용자 검색 실패:', {
        message: serverMsg,
        status,
        response: axiosError?.response?.data,
        params: queryParams.toString()
      });

      throw new Error(serverMsg || '사용자 검색에 실패했습니다.');
    }
  }
};
