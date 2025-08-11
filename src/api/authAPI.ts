import { apiInstance } from './apiInstance';
import type { 
  LoginRequest, 
  LoginResponse, 
  SignUpRequest, 
  SignUpResponse, 
  TokenReissueResponse, 
  EmailValidationResponse 
} from '@/types/auth';

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

      throw new Error(
        axiosError?.response?.data?.message ||
        axiosError?.response?.data?.error ||
        axiosError?.message
      );
    }
  },

  // 토큰 재발급
  reissueToken: async (accessToken: string): Promise<TokenReissueResponse> => {
    try {
      const response = await apiInstance.post('/admin/auth/reissue', {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.data.data || response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string; error?: string }; headers?: Record<string, unknown> }; message?: string };
      
      throw new Error(
        axiosError?.response?.data?.message || 
        axiosError?.response?.data?.error || 
        axiosError?.message || '토큰 재발급 중 오류가 발생했습니다.'
      );
    }
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    try {
      await apiInstance.post('/admin/auth/logout');
      // 성공 시 HTTP 204 No Content이므로 응답 데이터 없음
    } catch (error: unknown) {
      const axiosError = error as { 
        response?: { 
          status?: number; 
          statusText?: string;
          data?: { message?: string; error?: string }; 
          headers?: Record<string, unknown>;
          config?: { url?: string; method?: string };
        }; 
        message?: string;
        config?: { url?: string; method?: string };
      };
      
      throw new Error(
        axiosError?.response?.data?.message || 
        axiosError?.response?.data?.error || 
        axiosError?.message || '로그아웃 중 오류가 발생했습니다.'
      );
    }
  },

  // 회원가입 API (공개 API - 토큰 불필요)
  signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    const sanitized: SignUpRequest = {
      email: data.email?.trim(),
      employeeNumber: data.employeeNumber?.trim(),
      password: data.password?.trim(),
    } as SignUpRequest;

    if (!sanitized.email || !sanitized.employeeNumber || !sanitized.password) {
      throw new Error('모든 필드를 입력해주세요.');
    }

    try {
      const response = await apiInstance.post<SignUpResponse>(
        '/admin/auth/join',
        sanitized,
        { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
      );

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string; error?: string };
          headers?: Record<string, unknown>
        };
        message?: string
      };

      throw new Error(
        axiosError?.response?.data?.message ||
        axiosError?.response?.data?.error ||
        axiosError?.message || '회원가입 중 오류가 발생했습니다.'
      );
    }
  },

  // 이메일 중복 확인 API (공개 API - 토큰 불필요)
  validateEmail: async (email: string): Promise<EmailValidationResponse> => {
    try {
      const response = await apiInstance.post<{
        data: EmailValidationResponse;
      }>('/admin/email/validation', { email });

      const { data: responseData } = response.data;
      return responseData;
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string; error?: string }; headers?: Record<string, unknown> }; message?: string };

      throw new Error(
        axiosError?.response?.data?.message ||
        axiosError?.response?.data?.error ||
        axiosError?.message
      );
    }
  },

  // 이메일 인증번호 전송 API (공개 API - 토큰 불필요)
  sendAuthCode: async (email: string, isDuplicateEmail: boolean): Promise<void> => {
    try {
      await apiInstance.post('/admin/email/send', {
        email,
        isDuplicateEmail
      });
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string; error?: string }; headers?: Record<string, unknown> }; message?: string };

      throw new Error(
        axiosError?.response?.data?.message ||
        axiosError?.response?.data?.error ||
        axiosError?.message
      );
    }
  },

  // 이메일 인증번호 확인 API (공개 API - 토큰 불필요)
  verifyAuthCode: async (email: string, verificationNumber: string): Promise<void> => {
    try {
      await apiInstance.post('/admin/email/verification', {
        email,
        verificationNumber
      });
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string; error?: string }; headers?: Record<string, unknown> }; message?: string };

      throw new Error(
        axiosError?.response?.data?.message ||
        axiosError?.response?.data?.error ||
        axiosError?.message
      );
    }
  },

  // 비밀번호 재설정 API (공개 API - 토큰 불필요)
  resetPassword: async (data: { email: string; newPassword: string; verificationCode: string }): Promise<void> => {
    const sanitized = {
      email: data.email?.trim(),
      newPassword: data.newPassword?.trim(),
      verificationCode: data.verificationCode?.trim(),
    };

    if (!sanitized.email || !sanitized.newPassword || !sanitized.verificationCode) {
      throw new Error('모든 필드를 입력해주세요.');
    }

    try {
      await apiInstance.post('/admin/auth/password/reset', sanitized, {
        headers: { 'Content-Type': 'application/json' }
      });
      // 성공 시 HTTP 204 No Content이므로 응답 데이터 없음
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string; error?: string }; headers?: Record<string, unknown> }; message?: string };

      throw new Error(
        axiosError?.response?.data?.message ||
        axiosError?.response?.data?.error ||
        axiosError?.message || '비밀번호 재설정 중 오류가 발생했습니다.'
      );
    }
  },
};
