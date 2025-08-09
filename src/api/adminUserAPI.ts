import { apiInstance } from './apiInstance';

// 사용자 정보 인터페이스
interface AdminUser {
  userId: number;
  userName: string;
  department: string;
  email: string;
  role: string;
}

// 페이징 정보 인터페이스
interface PagingInfo {
  currentPageNumber: number;
  pageSize: number;
  elementCount: number;
  totalPageCount: number;
  isLastPage: boolean;
  isEmpty: boolean;
}

// API 응답 인터페이스
interface AdminUserListResponse {
  adminInfoList: AdminUser[];
  pagingInfo: PagingInfo;
}

// 요청 파라미터 인터페이스
interface AdminUserListRequest {
  pageNumber: number;
  pageSize?: number; // 기본값 7
}

// 관리자 사용자 관련 API 함수들
export const adminUserAPI = {
  // 사용자 목록 조회
  getAdminUserList: async (params: AdminUserListRequest): Promise<AdminUserListResponse> => {
    const queryParams = new URLSearchParams({
      pageNumber: params.pageNumber.toString(),
      pageSize: (params.pageSize || 7).toString(), // 기본값 7로 고정
    });

    console.log('사용자 목록 조회 요청:', `/admin/user?${queryParams.toString()}`);

    try {
      const response = await apiInstance.get<AdminUserListResponse>(
        `/admin/user?${queryParams.toString()}`,
        {
          headers: { 
            'Content-Type': 'application/json', 
            Accept: 'application/json' 
          }
        }
      );

      console.log('사용자 목록 조회 성공:', response.data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string; error?: string } }; message?: string };
      const status = axiosError?.response?.status;
      const serverMsg = axiosError?.response?.data?.message || axiosError?.response?.data?.error || axiosError?.message;
      
      console.error('사용자 목록 조회 실패:', {
        message: serverMsg,
        status,
        response: axiosError?.response?.data,
        params: queryParams.toString()
      });

      const errorToThrow = new Error(serverMsg || '사용자 목록 조회에 실패했습니다.');
      throw errorToThrow;
    }
  },

  // TODO: 다른 개발자가 필요에 따라 추가할 수 있는 API 함수들
  
  // 사용자 상세 조회 (예시)
  // getAdminUser: async (userId: number): Promise<AdminUser> => {
  //   const response = await apiInstance.get<AdminUser>(`/admin/user/${userId}`);
  //   return response.data;
  // },

  // 사용자 생성 (예시)
  // createAdminUser: async (userData: Omit<AdminUser, 'userId'>): Promise<AdminUser> => {
  //   const response = await apiInstance.post<AdminUser>('/admin/user', userData);
  //   return response.data;
  // },

  // 사용자 수정 (예시)
  // updateAdminUser: async (userId: number, userData: Partial<Omit<AdminUser, 'userId'>>): Promise<AdminUser> => {
  //   const response = await apiInstance.put<AdminUser>(`/admin/user/${userId}`, userData);
  //   return response.data;
  // },

  // 사용자 삭제 (예시)
  // deleteAdminUser: async (userId: number): Promise<void> => {
  //   await apiInstance.delete(`/admin/user/${userId}`);
  // },

  // 사용자 역할 변경 (예시)
  // updateUserRole: async (userId: number, role: string): Promise<AdminUser> => {
  //   const response = await apiInstance.patch<AdminUser>(`/admin/user/${userId}/role`, { role });
  //   return response.data;
  // },

  // 부서별 사용자 조회 (예시)
  // getUsersByDepartment: async (department: string, params: AdminUserListRequest): Promise<AdminUserListResponse> => {
  //   const queryParams = new URLSearchParams({
  //     pageNumber: params.pageNumber.toString(),
  //     pageSize: (params.pageSize || 7).toString(),
  //     department: department
  //   });
  //   const response = await apiInstance.get<AdminUserListResponse>(`/admin/user?${queryParams.toString()}`);
  //   return response.data;
  // },

  // 역할별 사용자 조회 (예시)
  // getUsersByRole: async (role: string, params: AdminUserListRequest): Promise<AdminUserListResponse> => {
  //   const queryParams = new URLSearchParams({
  //     pageNumber: params.pageNumber.toString(),
  //     pageSize: (params.pageSize || 7).toString(),
  //     role: role
  //   });
  //   const response = await apiInstance.get<AdminUserListResponse>(`/admin/user?${queryParams.toString()}`);
  //   return response.data;
  // }
};

// 타입들을 export하여 다른 파일에서 사용할 수 있도록 함
export type { AdminUser, PagingInfo, AdminUserListResponse, AdminUserListRequest };
