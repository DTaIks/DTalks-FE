import { apiInstance } from '@/api/apiInstance';

interface PermissionResponse {
  code: number;
  status: string;
  message: string;
  data: PermissionUserResponse[];
}

interface PermissionUserResponse {
  roleId: number;
  roleUserCount: number;
  isActive: string;
}

// 권한 변경 요청 타입
interface ChangeUserRoleRequest {
  userIdList: number[];
  roleId: number;
}

// 권한 변경 응답 타입
interface ChangeUserRoleResponse {
  code: number;
  status: string;
  message: string;
  data?: {
    changedCount?: number;
    successUserIds?: number[];
    failedUserIds?: number[];
  };
}

import type { 
  PermissionUser,
  PermissionResponse,
  AdminRoleInfoRequest,
  AdminRoleInfoResponse,
  AdminRoleSearchRequest,
  AdminRoleSearchResponse,
  ChangeUserRoleRequest,
  ChangeUserRoleResponse
} from '@/types/permission';

export const permissionAPI = {
  // 권한 목록 조회
  getPermissions: async (): Promise<{ roleId: number; roleUserCount: number; isActive: string }[]> => {
    try {
      const response = await apiInstance.get<PermissionResponse>('/admin/role');
      return response.data.data.map(item => ({
        roleId: item.roleId,
        roleUserCount: item.roleUserCount,
        isActive: item.isActive === '활성' ? 'active' : 'inactive',
      }));
    } catch {
      throw new Error('권한 목록을 불러오는데 실패했습니다.');
    }
  },

  // 권한 기준 정렬된 사용자 목록 조회
  getAdminRoleInfo: async (params: AdminRoleInfoRequest): Promise<AdminRoleInfoResponse> => {
    const queryParams = new URLSearchParams({
      roleId: params.roleId.toString(),
      pageNumber: params.pageNumber.toString()
    });

    try {
      const response = await apiInstance.get<AdminRoleInfoResponse>(
        `/admin/user/role?${queryParams.toString()}`,
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

      throw new Error(serverMsg || '권한 기준 사용자 목록을 불러오는데 실패했습니다.');
    }
  },

  // 권한 기준 정렬된 이름 기반 검색
  searchAdminRoleByName: async (params: AdminRoleSearchRequest): Promise<AdminRoleSearchResponse> => {
    const queryParams = new URLSearchParams({
      roleId: params.roleId.toString(),
      name: params.name,
      pageNumber: params.pageNumber.toString()
    });

    try {
      const response = await apiInstance.get<AdminRoleSearchResponse>(
        `/admin/user/role/search?${queryParams.toString()}`,
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

      throw new Error(serverMsg || '사용자 권한 검색에 실패했습니다.');
    }
  },

  // 사용자 권한 변경
  changeUserRole: async (params: ChangeUserRoleRequest): Promise<ChangeUserRoleResponse> => {
    try {
      const response = await apiInstance.patch<ChangeUserRoleResponse>(
        '/admin/role/user/change',
        params,
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
          data?: {
             message?: string;
             error?: string;
            code?: number;
          }
        };
        message?: string
      };

      const serverMsg = axiosError?.response?.data?.message ||
                        axiosError?.response?.data?.error ||
                        axiosError?.message;

      throw new Error(serverMsg || '권한 변경에 실패했습니다.');
    }
  }
}
