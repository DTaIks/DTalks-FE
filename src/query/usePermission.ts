import { useQuery } from '@tanstack/react-query';
import { permissionAPI } from '@/api/permissionAPI';
import type { PermissionUser } from '@/types/permission';

export const PERMISSION_QUERY_KEY = ['permissions'];

export function usePermissions() {
  return useQuery<Pick<PermissionUser, 'roleId' | 'roleUserCount' | 'isActive'>[], Error>({
    queryKey: PERMISSION_QUERY_KEY,
    queryFn: () => permissionAPI.getPermissions(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
