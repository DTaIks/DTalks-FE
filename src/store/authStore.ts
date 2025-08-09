import { create } from 'zustand';
import { deleteCookie } from '@/utils/cookieUtils';

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
  error: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  
  // 순수한 상태 변경 액션들 (API 로직 없음)
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  logout: () => void;
}

// 새로고침 복원: 로그인 여부를 로컬 스토리지에서 복원
const persistedIsAuthenticated =
  typeof window !== 'undefined' && localStorage.getItem('auth:isAuthenticated') === 'true';

const initialAuthState = {
  isAuthenticated: persistedIsAuthenticated,
  isLoading: false,
};

export const useAuthStore = create<AuthState>()(
  (set) => ({
    // 초기 상태 - 즉시 인증 상태 확인
    user: null,
    isAuthenticated: initialAuthState.isAuthenticated,
    isLoading: initialAuthState.isLoading,
    error: null,
    accessToken: null,
    refreshToken: null,

    // 순수한 상태 변경 액션들
    setUser: (user) => {
      set({ user });
    },

    setAuthenticated: (isAuthenticated) => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth:isAuthenticated', String(Boolean(isAuthenticated)));
        }
      } catch {}
      set({ isAuthenticated });
    },

    setLoading: (loading) => {
      set({ isLoading: loading });
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

    logout: () => {
      // 인증 관련 쿠키들 삭제
      const authCookieNames = [
        'JSESSIONID',
        'access_token', 
        'auth_token',
        'session',
        'token',
        'Authorization'
      ];
      
      authCookieNames.forEach(cookieName => {
        deleteCookie(cookieName);
        deleteCookie(cookieName, '/', window.location.hostname);
      });
      
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth:isAuthenticated', 'false');
        }
      } catch {}

      set({
        user: null,
        isAuthenticated: false,
        error: null,
        accessToken: null,
        refreshToken: null,
      });
    },
  })
); 