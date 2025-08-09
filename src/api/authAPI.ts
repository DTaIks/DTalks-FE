import { apiInstance } from './apiInstance';

// 요청 인터페이스
interface LoginRequest {
  email: string;
  password: string;
}

// interface SignupRequest {
//   email: string;
//   password: string;
//   employeeNumber: string;
//   authCode: string;
// }

// 응답 인터페이스 (토큰만 받음)
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// interface SignupResponse {
//   user: {
//     id: string;
//     email: string;
//     name?: string;
//     employeeNumber?: string;
//   };
// }

// 인증 관련 API 함수들
export const authAPI = {
  // 로그인 (토큰 받음)
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const sanitized: LoginRequest = {
      email: data.email?.trim(),
      password: data.password?.trim(),
    } as LoginRequest;

    console.log('로그인 요청 데이터:', JSON.stringify(sanitized, null, 2));
    console.log('전체 요청 URL:', `${import.meta.env.VITE_API_URL || '/api'}/admin/auth/login`);

    if (!sanitized.email || !sanitized.password) {
      throw new Error('이메일과 비밀번호를 입력해주세요.');
    }

    try {
      const response = await apiInstance.post<LoginResponse>(
        '/admin/auth/login',
        sanitized,
        { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
      );

      console.log('로그인 성공:', response.data);
      return response.data;
    } catch (error: any) {
      const status = error?.response?.status;
      const serverMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message;
      console.error('로그인 실패 상세:', {
        message: serverMsg,
        status,
        response: error?.response?.data,
        headers: error?.response?.headers
      });

      if (serverMsg) error.message = serverMsg;
      throw error;
    }
  },

  // 로그아웃 (쿠키 인증, 204 No Content)
  logout: async (): Promise<void> => {
    await apiInstance.post('/admin/auth/logout');
  },

  // 회원가입 (쿠키로 토큰 받음)
  // signup: async (data: SignupRequest): Promise<SignupResponse> => {
  //   const response = await apiInstance.post<SignupResponse>('/admin/auth/signup', data);
  //   return response.data;
  // },

  // 이메일 중복 확인
  // checkEmailDuplicate: async (email: string): Promise<{ isDuplicate: boolean }> => {
  //   const response = await apiInstance.get<{ isDuplicate: boolean }>(`/admin/auth/check-email?email=${encodeURIComponent(email)}`);
  //   return response.data;
  // },

  // 인증번호 발송
  // sendAuthCode: async (email: string): Promise<{ message: string }> => {
  //   const response = await apiInstance.post<{ message: string }>('/admin/auth/send-code', { email });
  //   return response.data;
  // },

  // 인증번호 확인
  // verifyAuthCode: async (email: string, code: string): Promise<{ isValid: boolean }> => {
  //   const response = await apiInstance.post<{ isValid: boolean }>('/admin/auth/verify-code', { email, code });
  //   return response.data;
  // },

  // 로그아웃
  // logout: async (): Promise<void> => {
  //   await apiInstance.post<void>('/admin/auth/logout');
  // },

  // 토큰 갱신
  // refreshToken: async (): Promise<{ accessToken: string }> => {
  //   const response = await apiInstance.post<{ accessToken: string }>('/admin/auth/refresh');
  //   return response.data;
  // },

  // 현재 사용자 정보 가져오기
  // getCurrentUser: async (): Promise<LoginResponse['user']> => {
  //   const response = await apiInstance.get<LoginResponse['user']>('/admin/auth/me');
  //   return response.data;
  // },

  // 토큰 유효성 확인
  // validateToken: async (): Promise<boolean> => {
  //   try {
  //     await apiInstance.get('/admin/auth/validate');
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }
}; 