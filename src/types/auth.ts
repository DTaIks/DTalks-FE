// 인증 관련 타입 정의
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpRequest {
  email: string;
  employeeNumber: string;
  password: string;
}

export interface SignUpResponse {
  message: string;
}

export interface TokenReissueResponse {
  accessToken: string;
  refreshToken: string;
}

export interface EmailValidationResponse {
  isDuplicate: boolean;
}

// 사용자 정보 타입
export interface User {
  id: string;
  email: string;
  name?: string;
  employeeNumber?: string;
}

// 인증 상태 타입
export interface AuthState {
  // 클라이언트 상태만 관리
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthChecking: boolean; // 인증 확인 중 상태 추가
  error: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
}

// 인증 액션 타입
export interface AuthActions {
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

// 전체 인증 스토어 타입
export type AuthStore = AuthState & AuthActions;
