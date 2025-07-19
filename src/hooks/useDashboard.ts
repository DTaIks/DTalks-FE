import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDashboardStore } from '../store/dashboardStore';
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  getDashboardStats,
  type UsersParams,
  type User
} from '../api/dashboardAPI';

// 사용자 목록 조회
export const useUsers = (params: UsersParams) => {
  const { setUsers, setLoading, setError, setCurrentPage, setTotalPages } = useDashboardStore();
  
  const query = useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  });
  
  // 상태 업데이트를 위한 useEffect 대신 즉시 실행
  if (query.data) {
    setUsers(query.data.users);
    setTotalPages(query.data.totalPages);
    setCurrentPage(query.data.currentPage);
    setLoading(false);
    setError(null);
  }
  
  if (query.error) {
    setLoading(false);
    setError(query.error instanceof Error ? query.error.message : '사용자 목록을 불러오는데 실패했습니다.');
  }
  
  if (query.isPending) {
    setLoading(true);
  }
  
  return query;
};

// 대시보드 통계 조회
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5분
    refetchInterval: 1000 * 60 * 10, // 10분마다 자동 갱신
  });
};

// 사용자 추가
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { addUser } = useDashboardStore();
  
  return useMutation({
    mutationFn: (userData: Omit<User, 'id'>) => createUser(userData),
    onSuccess: (newUser) => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
      // 로컬 상태 업데이트
      addUser(newUser);
    },
    onError: (error) => {
      console.error('사용자 추가 실패:', error);
    }
  });
};

// 사용자 수정
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { updateUser: updateUserInStore } = useDashboardStore();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) =>
      updateUser(id, updates),
    onSuccess: (updatedUser) => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
      // 로컬 상태 업데이트
      updateUserInStore(updatedUser.id, updatedUser);
    },
    onError: (error) => {
      console.error('사용자 수정 실패:', error);
    }
  });
};

// 사용자 삭제
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { deleteUser: deleteUserFromStore } = useDashboardStore();
  
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: (_, deletedId) => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
      // 로컬 상태 업데이트
      deleteUserFromStore(deletedId);
    },
    onError: (error) => {
      console.error('사용자 삭제 실패:', error);
    }
  });
};

// 사용자 상태 토글
export const useToggleUserStatus = () => {
  const updateUserMutation = useUpdateUser();
  
  return {
    ...updateUserMutation,
    mutate: (id: string, currentStatus: 'active' | 'inactive') => {
      updateUserMutation.mutate({
        id,
        updates: { status: currentStatus === 'active' ? 'inactive' : 'active' }
      });
    }
  };
}; 