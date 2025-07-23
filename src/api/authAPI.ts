// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  employeeNumber: string;
  authCode: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    employeeNumber?: string;
  };
  token: string;
}

// API 호출 헬퍼 함수
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// 인증 관련 API 함수들
export const authAPI = {
  // 로그인
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    return apiCall<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 이메일 중복 확인
  checkEmailDuplicate: async (email: string): Promise<{ isDuplicate: boolean }> => {
    return apiCall<{ isDuplicate: boolean }>(`/auth/check-email?email=${encodeURIComponent(email)}`);
  },

  // 인증번호 발송
  sendAuthCode: async (email: string): Promise<{ message: string }> => {
    return apiCall<{ message: string }>('/auth/send-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // 인증번호 확인
  verifyAuthCode: async (email: string, code: string): Promise<{ isValid: boolean }> => {
    return apiCall<{ isValid: boolean }>('/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    return apiCall<void>('/auth/logout', {
      method: 'POST',
    });
  },

  // 토큰 갱신
  refreshToken: async (): Promise<{ token: string }> => {
    return apiCall<{ token: string }>('/auth/refresh', {
      method: 'POST',
    });
  },
}; 