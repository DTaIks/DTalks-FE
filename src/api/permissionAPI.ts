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

export const permissionAPI = {
  getPermissions: async (): Promise<Pick<PermissionUser, 'roleId' | 'roleUserCount' | 'isActive'>[]> => {
    const response = await apiInstance.get<PermissionResponse>('/admin/role');
    return response.data.data.map(item => ({
      roleId: item.roleId,
      roleUserCount: item.roleUserCount,
      isActive: item.isActive === '활성' ? 'active' : 'inactive',
    }));
  },
};
