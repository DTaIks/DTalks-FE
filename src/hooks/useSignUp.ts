import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from '@/utils/signUpSchema';
import type { SignUpFormData } from '@/utils/signUpSchema';

// 추후에 백엔드 측에서 설정한 시간으로 변경
const AUTH_TIMEOUT = 300;

interface AuthState {
  isEmailVerified: boolean;
  isAuthCodeSent: boolean;
  isAuthCodeVerified: boolean;
  authTimer: number;
  canResend: boolean;
}

export const useSignUp = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isEmailVerified: false,
    isAuthCodeSent: false,
    isAuthCodeVerified: false,
    authTimer: 0,
    canResend: false
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
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

  // 이메일 중복 확인
  const handleEmailCheck = () => {
    const email = watch('email');
    if (!email) return;

    // 이메일 유효성 검사
    try {
      signUpSchema.validateSyncAt('email', { email });
    } catch {
      return; // 에러가 있으면 중복 확인을 진행하지 않음
    }

    // 실제로는 API 호출
    setAuthState(prev => ({ ...prev, isEmailVerified: true }));
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
  const onSubmit = (data: SignUpFormData) => {
    console.log('회원가입 데이터:', data);
    // 실제 회원가입 API 호출
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
