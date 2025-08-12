import { apiInstance } from '@/api/apiInstance';
import type { PermissionUser } from '@/types/permission';

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

export const permissionAPI = {
  // 권한 목록 조회
  getPermissions: async (): Promise<Pick<PermissionUser, 'roleId' | 'roleUserCount' | 'isActive'>[]> => {
    try {
      const response = await apiInstance.get<PermissionResponse>('/admin/role');
      return response.data.data.map(item => ({
        roleId: item.roleId,
        roleUserCount: item.roleUserCount,
        isActive: item.isActive === '활성' ? 'active' : 'inactive',
      }));
    } catch (error) {
      console.error('권한 목록 조회 실패:', error);
      throw new Error('권한 목록을 불러오는데 실패했습니다.');
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

      const status = axiosError?.response?.status;
      const serverMsg = axiosError?.response?.data?.message ||
                        axiosError?.response?.data?.error ||
                        axiosError?.message;

      console.error('권한 변경 실패:', {
        message: serverMsg,
        status,
        response: axiosError?.response?.data,
        requestParams: params
      });

      throw new Error(serverMsg || '권한 변경에 실패했습니다.');
    }
  }
};
