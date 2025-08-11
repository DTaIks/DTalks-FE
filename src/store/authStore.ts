import { create } from 'zustand';
import { apiInstance } from '@/api/apiInstance';
import { authAPI } from '@/api/authAPI';

interface User {
  id: string;
  email: string;
  name?: string;
  employeeNumber?: string;
}

interface AuthState {
  // 클라이언트 상태만 관리
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthChecking: boolean; // 인증 확인 중 상태 추가
  error: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  
  // 순수한 상태 변경 액션들 (API 로직 없음)
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setAuthChecking: (checking: boolean) => void; // 인증 확인 상태 설정
  setError: (error: string | null) => void;
  clearError: () => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  logout: () => void;
  reissueToken: () => Promise<void>;
}

const initialAuthState = {
  isAuthenticated: false, // 초기값은 false로 설정
  isLoading: false,
  isAuthChecking: true, // 앱 시작 시 인증 확인 중으로 설정
};

export const useAuthStore = create<AuthState>()(
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

    logout: async () => {
      try {
        // 서버에 로그아웃 요청 (쿠키 자동 전송)
        await authAPI.logout();
      } catch (error) {
        // 로그아웃 API 실패해도 클라이언트 상태는 초기화
        console.error('로그아웃 API 호출 실패:', error);
      } finally {
        // 클라이언트 상태 초기화
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          isAuthChecking: false,
        });
      }
    },
  })
); 