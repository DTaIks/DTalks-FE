import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionAPI } from '@/api/permissionAPI';
import type { PermissionUser } from '@/types/permission';

export const PERMISSION_QUERY_KEY = ['permissions'];
export const ADMIN_USER_QUERY_KEY = ['adminUsers'];

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