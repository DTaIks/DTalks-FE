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
