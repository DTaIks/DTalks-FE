import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { passwordResetSchema } from '@/utils/passwordResetSchema';
import type { PasswordResetFormData } from '@/utils/passwordResetSchema';

// 추후에 백엔드 측에서 설정한 시간으로 변경
const AUTH_TIMEOUT = 300;

interface AuthState {
  isEmailVerified: boolean;
  isAuthCodeSent: boolean;
  isAuthCodeVerified: boolean;
  authTimer: number;
  canResend: boolean;
  emailError: string;
}

export const usePassword = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isEmailVerified: false,
    isAuthCodeSent: false,
    isAuthCodeVerified: false,
    authTimer: 0,
    canResend: false,
    emailError: ''
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<PasswordResetFormData>({
    resolver: yupResolver(passwordResetSchema),
    mode: 'onChange'
  });

  // 타이머 관리
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (authState.authTimer > 0) {
      interval = setInterval(() => {
        setAuthState(prev => {
          const newTimer = prev.authTimer - 1;
          if (newTimer === 0) {
            return { ...prev, authTimer: 0, canResend: true };
          }
          return { ...prev, authTimer: newTimer };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authState.authTimer]);

  // 이메일 인증 확인
  const handleEmailCheck = () => {
    const email = watch('email');
    if (!email) return;

    // 이메일 유효성 검사
    try {
      passwordResetSchema.validateSyncAt('email', { email });
    } catch (error) {
      return; // 에러가 있으면 인증 확인을 진행하지 않음
    }

    // 실제로는 API 호출하여 가입된 이메일인지 확인
    // 여기서는 모의 데이터로 확인
    const mockRegisteredEmails = ['test@example.com', 'user@company.com'];
    const isRegistered = mockRegisteredEmails.includes(email);
    
    if (isRegistered) {
      setAuthState(prev => ({ ...prev, isEmailVerified: true, emailError: '' }));
    } else {
      // 가입되지 않은 이메일인 경우 에러 메시지 표시
      setAuthState(prev => ({ 
        ...prev, 
        isEmailVerified: false, 
        emailError: '가입되지 않은 이메일입니다.' 
      }));
    }
  };

  // 인증번호 전송
  const handleAuthCodeSend = () => {
    setAuthState(prev => ({
      ...prev,
      isAuthCodeSent: true,
      authTimer: AUTH_TIMEOUT,
      canResend: false
    }));
  };

  // 인증번호 확인
  const handleAuthCodeVerify = () => {
    const authCode = watch('authCode');
    if (!authCode || authCode.length !== 6) return;

    // 실제로는 API 호출
    setAuthState(prev => ({
      ...prev,
      isAuthCodeVerified: true,
      authTimer: 0
    }));
  };

  // 인증번호 재전송
  const handleAuthCodeResend = () => {
    setAuthState(prev => ({
      ...prev,
      authTimer: AUTH_TIMEOUT,
      canResend: false
    }));
  };

  // 폼 제출
  const onSubmit = (data: PasswordResetFormData) => {
    console.log('비밀번호 재설정 데이터:', data);
    // 실제 비밀번호 재설정 API 호출
  };

  // 유틸리티 함수들
  const formatTimer = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getAuthButtonText = (): string => {
    if (!authState.isAuthCodeSent) return '인증번호 받기';
    if (authState.isAuthCodeVerified) return '인증완료';
    if (authState.authTimer > 0) return '인증번호 확인';
    return '재전송';
  };

  const getAuthButtonClick = (): (() => void) => {
    if (!authState.isAuthCodeSent) return handleAuthCodeSend;
    if (authState.authTimer > 0 && !authState.isAuthCodeVerified) return handleAuthCodeVerify;
    return handleAuthCodeResend;
  };

  const isAuthButtonDisabled = (): boolean => {
    if (!authState.isEmailVerified) return true;
    if (authState.isAuthCodeVerified) return true;
    if (authState.isAuthCodeSent && authState.authTimer > 0 && !watch('authCode') && !authState.isAuthCodeVerified) return true;
    return false;
  };

  const isSubmitEnabled = (): boolean => {
    return isValid && authState.isEmailVerified && authState.isAuthCodeVerified;
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    watch,
    errors,
    authState,
    handleEmailCheck,
    getAuthButtonText,
    getAuthButtonClick,
    isAuthButtonDisabled,
    isSubmitEnabled,
    formatTimer
  };
};
