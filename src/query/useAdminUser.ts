import { useQuery } from '@tanstack/react-query';
import { adminUserAPI } from '@/api/adminUserAPI';
import type {
  AdminUserListRequest,
  AdminUserListResponse,
  AdminUserSearchRequest,
  AdminUserSearchResponse,
} from '@/types/user';

export const useAdminUsers = (params: AdminUserListRequest) => {
  console.log('UI params (1-based):', { 
    pageNumber: params.pageNumber, 
    pageSize: params.pageSize 
  });
  console.log('API params (0-based):', {
    pageNumber: params.pageNumber - 1,
    pageSize: params.pageSize
  });
  console.log('queryKey:', ['adminUsers', 'list', params]);

  return useQuery<AdminUserListResponse>({
    queryKey: ['adminUsers', 'list', params],
    queryFn: () => {
      console.log('목록 API 호출:', {
        pageNumber: params.pageNumber - 1,
        pageSize: params.pageSize
      });
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
  console.log('UI params (1-based):', { 
    name: params.name, 
    pageNumber: params.pageNumber, 
    pageSize: params.pageSize 
  });
  console.log('API params (0-based):', {
    name: params.name,
    pageNumber: params.pageNumber - 1,
    pageSize: params.pageSize
  });
  console.log('enabled:', enabled);
  console.log('queryKey:', ['adminUsers', 'search', params]);
  console.log('최종 enabled 값:', enabled);

  return useQuery<AdminUserSearchResponse>({
    queryKey: ['adminUsers', 'search', params],
    queryFn: () => {
      console.log('검색 API 호출:', {
        name: params.name,
        pageNumber: params.pageNumber - 1, 
        pageSize: params.pageSize
      });
      return adminUserAPI.searchAdminUsers({
        name: params.name,
        pageNumber: params.pageNumber - 1,
        pageSize: params.pageSize
      });
    },
    enabled,
  });
};
