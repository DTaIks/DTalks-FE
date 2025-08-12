import { create } from 'zustand';
import { authAPI } from '@/api/authAPI';
import type { AuthStore } from '@/types/auth';

const initialAuthState = {
  isAuthenticated: false, // 초기값은 false로 설정
  isLoading: false,
  isAuthChecking: true, // 앱 시작 시 인증 확인 중으로 설정
};

export const useAuthStore = create<AuthStore>()(
  (set) => ({
    // 초기 상태
    user: null,
    isAuthenticated: initialAuthState.isAuthenticated,
    isLoading: initialAuthState.isLoading,
    isAuthChecking: initialAuthState.isAuthChecking,
    error: null,
    accessToken: null,
    refreshToken: null,

    // 순수한 상태 변경 액션들
    setUser: (user) => {
      set({ user });
    },

    setAuthenticated: (isAuthenticated) => {
      set({ isAuthenticated });
    },

    setLoading: (loading) => {
      set({ isLoading: loading });
    },

    setAuthChecking: (checking) => {
      set({ isAuthChecking: checking });
    },

    setError: (error) => {
      set({ error });
    },

    clearError: () => {
      set({ error: null });
    },

    setAccessToken: (token) => {
      set({ accessToken: token });
    },

    setRefreshToken: (token) => {
      set({ refreshToken: token });
    },

    reissueToken: async () => {
      try {
        set({ isLoading: true, error: null });
        
        // HttpOnly 쿠키 기반이므로 별도 토큰 없이 쿠키만 전송
        const response = await authAPI.reissueToken();
        
        // 응답에서 새 토큰 추출 (백업용으로만 저장)
        const { accessToken, refreshToken } = response;
        
        set({ 
          accessToken, 
          refreshToken,
          isLoading: false 
        });
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } };
        const status = axiosError?.response?.status;
        
        let errorMessage = '토큰 재발급 실패';
        if (status === 410) {
          errorMessage = '세션이 만료되었습니다. 다시 로그인해주세요.';
        } else if (status === 401) {
          errorMessage = '인증이 필요합니다. 다시 로그인해주세요.';
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        set({ 
          error: errorMessage,
          isLoading: false 
        });
        throw error;
      }
    },

    logout: () => {
      // Zustand UI 상태만 초기화 (API 호출은 React Query에서 처리)
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        isAuthChecking: false,
      });
        },
  })
); 