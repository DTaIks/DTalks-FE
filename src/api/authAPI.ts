import type {
  EmailValidationResponse,
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  TokenReissueResponse
} from '@/types/auth';
import { apiInstance } from './apiInstance';

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
  verifyAuthCode: async (email: string, verificationNumber: string): Promise<{ data: { verificationCode: string } }> => {
    try {
      const response = await apiInstance.post<{ data: { verificationCode: string } }>('/admin/email/verification', {
        email,
        verificationNumber
      });
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

  // 프로필 조회 API
  getProfile: async (): Promise<{ name: string }> => {
    console.log('getProfile API 호출 시작');
    try {
      const response = await apiInstance.get('/admin/profile');
      console.log('getProfile API 전체 응답:', response);
      console.log('getProfile API 응답 데이터:', response.data);
      
      // 다양한 응답 구조 처리
      let profileData;
      if (response.data && typeof response.data === 'object') {
        // response.data가 객체인 경우
        if (response.data.name) {
          profileData = { name: response.data.name };
        } else if (response.data.data && response.data.data.name) {
          // data.data.name 구조
          profileData = { name: response.data.data.name };
        } else {
          // 다른 구조일 경우 첫 번째 문자열 값을 name으로 사용
          const values = Object.values(response.data);
          const nameValue = values.find(val => typeof val === 'string');
          profileData = { name: nameValue || 'admin' };
        }
      } else {
        // response.data가 문자열인 경우
        profileData = { name: response.data || 'admin' };
      }
      
      console.log('처리된 프로필 데이터:', profileData);
      return profileData;
    } catch (error: unknown) {
      console.error('getProfile API 에러:', error);
      const axiosError = error as { response?: { status?: number; data?: { message?: string; error?: string }; headers?: Record<string, unknown> }; message?: string };

      throw new Error(
        axiosError?.response?.data?.message ||
        axiosError?.response?.data?.error ||
        axiosError?.message || '프로필 조회 중 오류가 발생했습니다.'
      );
    }
  },
};
