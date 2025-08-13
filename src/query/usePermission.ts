import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionAPI } from '@/api/permissionAPI';
import type { 
  PermissionUser, 
  AdminRoleInfoRequest, 
  AdminRoleInfoResponse, 
  AdminRoleSearchRequest, 
  AdminRoleSearchResponse 
} from '@/types/permission';

export const PERMISSION_QUERY_KEY = ['permissions'];
export const ADMIN_USER_QUERY_KEY = ['adminUsers'];
export const ADMIN_ROLE_INFO_QUERY_KEY = ['adminRoleInfo'];
export const ADMIN_ROLE_SEARCH_QUERY_KEY = ['adminRoleSearch'];

// 권한 목록 조회
export function usePermissions() {
  return useQuery<Pick<PermissionUser, 'roleId' | 'roleUserCount' | 'isActive'>[], Error>({
    queryKey: PERMISSION_QUERY_KEY,
    queryFn: () => permissionAPI.getPermissions(),
    staleTime: 1000 * 60 * 15, // 15분
    gcTime: 1000 * 60 * 45, // 45분
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: (previousData: Pick<PermissionUser, 'roleId' | 'roleUserCount' | 'isActive'>[] | undefined) => previousData,
  });
}

// 권한별 사용자 목록 조회
export function useAdminRoleInfo(params: AdminRoleInfoRequest, enabled: boolean = true) {
  return useQuery<AdminRoleInfoResponse, Error>({
    queryKey: [...ADMIN_ROLE_INFO_QUERY_KEY, params.roleId, params.pageNumber],
    queryFn: () => permissionAPI.getAdminRoleInfo(params),
    enabled: enabled && Boolean(params.roleId),
    refetchOnWindowFocus: false,
  });
}

// 권한 기준 사용자 검색
export function useAdminRoleSearch(params: AdminRoleSearchRequest, enabled: boolean = true) {
  return useQuery<AdminRoleSearchResponse, Error>({
    queryKey: [...ADMIN_ROLE_SEARCH_QUERY_KEY, params.roleId, params.name, params.pageNumber],
    queryFn: () => permissionAPI.searchAdminRoleByName(params),
    enabled: enabled && Boolean(params.roleId) && Boolean(params.name.trim()),
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
  });
}

// 권한 변경 뮤테이션
export function useChangeUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: { userIdList: number[]; roleId: number }) =>
      permissionAPI.changeUserRole(params),
    onSuccess: () => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ADMIN_USER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PERMISSION_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_ROLE_INFO_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_ROLE_SEARCH_QUERY_KEY });
    },
    onError: (error: Error) => {
      throw error;
    }
  });
}

// 권한 변경 관련 유틸리티 훅
export function useRoleManagement() {
  const changeRoleMutation = useChangeUserRole();

  const handleRoleChange = async (
    userIds: number[],
    roleId: number,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    if (userIds.length === 0) {
      onError?.('권한을 변경할 사용자를 선택해주세요.');
      return;
    }

    try {
      await changeRoleMutation.mutateAsync({
        userIdList: userIds,
        roleId
      });
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '권한 변경에 실패했습니다.';
      onError?.(errorMessage);
    }
  };

  return {
    handleRoleChange,
    isLoading: changeRoleMutation.isPending,
    error: changeRoleMutation.error,
    isSuccess: changeRoleMutation.isSuccess,
    reset: changeRoleMutation.reset
  };
}
