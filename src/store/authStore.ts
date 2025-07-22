import { create } from 'zustand';

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
  
  // 순수한 상태 변경 액션들 (API 로직 없음)
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  (set) => ({
    // 초기 상태
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

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

    setError: (error) => {
      set({ error });
    },

    clearError: () => {
      set({ error: null });
    },

    logout: () => {
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    },
  })
); 