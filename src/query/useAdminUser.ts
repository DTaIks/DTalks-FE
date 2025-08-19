import { useQuery } from '@tanstack/react-query';
import { adminUserAPI } from '@/api/adminUserAPI';
import type {
  AdminUserListRequest,
  AdminUserListResponse,
  AdminUserSearchRequest,
  AdminUserSearchResponse,
} from '@/types/user';

export const useAdminUsers = (params: AdminUserListRequest) => {
  return useQuery<AdminUserListResponse>({
    queryKey: ['adminUsers', 'list', params],
    queryFn: () => {
      return adminUserAPI.getAdminUserList({
        pageNumber: params.pageNumber - 1, 
        pageSize: params.pageSize
      });
    },
  });
};

export const useAdminUserSearch = (
  params: AdminUserSearchRequest, 
  enabled: boolean
) => {
  return useQuery<AdminUserSearchResponse>({
    queryKey: ['adminUsers', 'search', params],
    queryFn: () => {
      return adminUserAPI.searchAdminUsers({
        name: params.name,
        pageNumber: params.pageNumber - 1,
        pageSize: params.pageSize
      });
    },
    enabled,
  });
};
