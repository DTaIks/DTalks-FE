import { useQuery } from '@tanstack/react-query';
import { adminUserAPI } from '@/api/adminUserAPI';
import type { 
  AdminUserListRequest, 
  AdminUserListResponse,
  AdminUserSearchRequest,
  AdminUserSearchResponse 
} from '@/types/user';

export const adminUserKeys = {
  all: ['adminUsers'] as const,
  lists: () => [...adminUserKeys.all, 'list'] as const,
  list: (params: AdminUserListRequest) => [...adminUserKeys.lists(), params] as const,
  searches: () => [...adminUserKeys.all, 'search'] as const,
  search: (params: AdminUserSearchRequest) => [...adminUserKeys.searches(), params] as const,
  details: () => [...adminUserKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminUserKeys.details(), id] as const,
};

// 사용자 목록 조회 쿼리
export const useAdminUsers = (params: AdminUserListRequest) => {
  return useQuery<AdminUserListResponse, Error>({
    queryKey: adminUserKeys.list(params),
    queryFn: () => adminUserAPI.getAdminUserList(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// 사용자 검색 쿼리 - enabled 조건 수정
export const useAdminUserSearch = (params: AdminUserSearchRequest, enabled: boolean = true) => {
  // 디버깅 로그 추가
  console.log('=== useAdminUserSearch 호출 ===');
  console.log('params:', params);
  console.log('enabled:', enabled);
  console.log('params.name.trim():', params.name.trim());
  console.log('최종 enabled 값:', enabled && !!params.name.trim());

  return useQuery<AdminUserSearchResponse, Error>({
    queryKey: adminUserKeys.search(params),
    queryFn: () => {
      console.log('검색 API 호출:', params);
      return adminUserAPI.searchAdminUsers(params);
    },
    enabled: enabled && params.name.trim().length > 0, 
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
