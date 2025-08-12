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
    const queryParams = new URLSearchParams({
      pageNumber: params.pageNumber.toString(),
      pageSize: (params.pageSize || 7).toString(),
    });

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

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string; error?: string }
        };
        message?: string
      };
      
      const serverMsg = axiosError?.response?.data?.message ||
                        axiosError?.response?.data?.error ||
                        axiosError?.message;

      throw new Error(serverMsg || '사용자 목록 조회에 실패했습니다.');
    }
  },

  // 사용자 검색
  searchAdminUsers: async (params: AdminUserSearchRequest): Promise<AdminUserSearchResponse> => {
    const queryParams = new URLSearchParams({
      name: params.name,
      pageNumber: params.pageNumber.toString(),
      pageSize: (params.pageSize || 7).toString(),
    });

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

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string; error?: string }
        };
        message?: string
      };
      
      const serverMsg = axiosError?.response?.data?.message ||
                        axiosError?.response?.data?.error ||
                        axiosError?.message;

      throw new Error(serverMsg || '사용자 검색에 실패했습니다.');
    }
  }
};
