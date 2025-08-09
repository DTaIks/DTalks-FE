import { apiInstance } from './apiInstance';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const authAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const sanitized: LoginRequest = {
      email: data.email?.trim(),
      password: data.password?.trim(),
    } as LoginRequest;

    if (!sanitized.email || !sanitized.password) {
      throw new Error('이메일과 비밀번호를 입력해주세요.');
    }

    try {
      const response = await apiInstance.post<LoginResponse>(
        '/admin/auth/login',
        sanitized,
        { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
      );

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string; error?: string }; headers?: Record<string, unknown> }; message?: string };
      const serverMsg = axiosError?.response?.data?.message || axiosError?.response?.data?.error || axiosError?.message;
      
      const errorToThrow = new Error(serverMsg || '로그인에 실패했습니다.');
      throw errorToThrow;
    }
  },

  logout: async (): Promise<void> => {
    await apiInstance.post('/admin/auth/logout');
  },

  checkEmailDuplicate: async (email: string): Promise<{ isDuplicate: boolean }> => {
     const response = await apiInstance.get<{ isDuplicate: boolean }>(`/admin/auth/check-email?email=${encodeURIComponent(email)}`);
     return response.data;
  },
}; 