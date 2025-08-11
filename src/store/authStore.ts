import { create } from 'zustand';
import { apiInstance } from '@/api/apiInstance';
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
        
        // 쿠키만 전송하여 토큰 재발급 요청
        const response = await apiInstance.post('/admin/auth/reissue');
        
        // 응답에서 새 토큰 추출
        const { accessToken, refreshToken } = response.data.data || response.data;
        
        set({ 
          accessToken, 
          refreshToken,
          isLoading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : '토큰 재발급 실패',
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