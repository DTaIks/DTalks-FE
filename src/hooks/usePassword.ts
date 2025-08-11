import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { passwordResetSchema } from '@/utils/passwordResetSchema';
import type { PasswordResetFormData } from '@/utils/passwordResetSchema';
import {
  useEmailValidationMutation,
  useSendAuthCodeMutation,
  useVerifyAuthCodeMutation,
  usePasswordResetMutation
} from '@/query/useAuthQueries';

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
  const navigate = useNavigate();
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
    formState: { errors, isValid },
    setError,
    clearErrors
  } = useForm<PasswordResetFormData>({
    resolver: yupResolver(passwordResetSchema),
    mode: 'onChange'
  });

  const emailValidationMutation = useEmailValidationMutation();
  const sendAuthCodeMutation = useSendAuthCodeMutation();
  const verifyAuthCodeMutation = useVerifyAuthCodeMutation();
  const passwordResetMutation = usePasswordResetMutation();

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

  // 이메일 인증 확인 (가입된 이메일인지 확인)
  const handleEmailCheck = async () => {
    const email = watch('email');
    if (!email) return;

    // 이메일 유효성 검사
    try {
      passwordResetSchema.validateSyncAt('email', { email });
    } catch {
      return; // 에러가 있으면 인증 확인을 진행하지 않음
    }

    // 이메일 중복 확인 API 호출하여 가입된 이메일인지 확인
    emailValidationMutation.mutate(email, {
      onSuccess: (result) => {
        if (result.isDuplicate) {
          // 가입된 이메일인 경우 (중복 = true)
          setAuthState(prev => ({ 
            ...prev, 
            isEmailVerified: true, 
            emailError: '' 
          }));
          clearErrors('email');
        } else {
          // 가입되지 않은 이메일인 경우 (중복 = false)
          setAuthState(prev => ({ 
            ...prev, 
            isEmailVerified: false, 
            emailError: '가입되지 않은 이메일입니다.' 
          }));
          setError('email', { 
            type: 'manual', 
            message: '가입되지 않은 이메일입니다.' 
          });
        }
      },
      onError: (error) => {
        setAuthState(prev => ({ 
          ...prev, 
          isEmailVerified: false,
          emailError: '이메일 확인 중 오류가 발생했습니다.'
        }));
        setError('email', { 
          type: 'manual', 
          message: '이메일 확인 중 오류가 발생했습니다.' 
        });
      }
    });
  };

  // 인증번호 전송
  const handleAuthCodeSend = async () => {
    const email = watch('email');
    if (!email || !authState.isEmailVerified) return;

    // 가입된 이메일이므로 isDuplicateEmail을 true로 설정
    sendAuthCodeMutation.mutate(
      { email, isDuplicateEmail: true },
      {
        onSuccess: () => {
          setAuthState(prev => ({
            ...prev,
            isAuthCodeSent: true,
            authTimer: AUTH_TIMEOUT,
            canResend: false
          }));
        },
        onError: (error) => {
          setError('authCode', {
            type: 'manual',
            message: error instanceof Error ? error.message : '인증번호 전송에 실패했습니다.'
          });
        }
      }
    );
  };

  // 인증번호 확인
  const handleAuthCodeVerify = async () => {
    const email = watch('email');
    const authCode = watch('authCode');
    
    if (!authCode || authCode.length !== 6) {
      setError('authCode', {
        type: 'manual',
        message: '인증번호 6자리를 입력해 주세요.'
      });
      return;
    }

    if (!email) return;

    verifyAuthCodeMutation.mutate(
      { email, verificationNumber: authCode },
      {
        onSuccess: () => {
          setAuthState(prev => ({
            ...prev,
            isAuthCodeVerified: true,
            authTimer: 0
          }));
          clearErrors('authCode');
        },
        onError: (error) => {
          setError('authCode', {
            type: 'manual',
            message: error instanceof Error ? error.message : '인증번호가 올바르지 않습니다.'
          });
        }
      }
    );
  };

  // 인증번호 재전송
  const handleAuthCodeResend = async () => {
    const email = watch('email');
    if (!email || !authState.isEmailVerified) return;

    // 가입된 이메일이므로 isDuplicateEmail을 true로 설정
    sendAuthCodeMutation.mutate(
      { email, isDuplicateEmail: true },
      {
        onSuccess: () => {
          setAuthState(prev => ({
            ...prev,
            authTimer: AUTH_TIMEOUT,
            canResend: false
          }));
        },
        onError: (error) => {
          setError('authCode', {
            type: 'manual',
            message: error instanceof Error ? error.message : '인증번호 재전송에 실패했습니다.'
          });
        }
      }
    );
  };

  // 폼 제출
  const onSubmit = async (data: PasswordResetFormData) => {
    if (!authState.isEmailVerified || !authState.isAuthCodeVerified) {
      return;
    }

    const resetData = {
      email: data.email,
      newPassword: data.password,
      verificationCode: data.authCode
    };

    passwordResetMutation.mutate(resetData, {
      onSuccess: () => {
        console.log('비밀번호 재설정 성공');
        // 비밀번호 재설정 성공 시 로그인 페이지로 리다이렉트
        navigate('/login');
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : '비밀번호 재설정 중 오류가 발생했습니다.';
        console.error('비밀번호 재설정 실패:', errorMessage);
        
        // 에러 메시지를 적절한 필드에 표시
        if (errorMessage.includes('인증번호') || errorMessage.includes('verification')) {
          setError('authCode', {
            type: 'manual',
            message: '인증번호가 올바르지 않습니다.'
          });
        } else if (errorMessage.includes('이메일')) {
          setError('email', {
            type: 'manual',
            message: '이메일 정보가 올바르지 않습니다.'
          });
        } else {
          setError('password', {
            type: 'manual',
            message: errorMessage
          });
        }
      }
    });
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
    return sendAuthCodeMutation.isPending || verifyAuthCodeMutation.isPending;
  };

  const isSubmitEnabled = (): boolean => {
    return isValid && authState.isEmailVerified && authState.isAuthCodeVerified;
  };

  const getEmailCheckButtonText = (): string => {
    if (emailValidationMutation.isPending) return '확인 중';
    if (authState.isEmailVerified) return '확인 완료';
    return '이메일 확인';
  };

  const isEmailCheckButtonDisabled = (): boolean => {
    const email = watch('email');
    return !email || emailValidationMutation.isPending || authState.isEmailVerified;
  };

  const getSubmitButtonText = (): string => {
    if (passwordResetMutation.isPending) return '비밀번호 재설정 중';
    if (passwordResetMutation.isSuccess) return '재설정 완료';
    return '비밀번호 재설정';
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
    formatTimer,
    getEmailCheckButtonText,
    isEmailCheckButtonDisabled,
    getSubmitButtonText
  };
};
