// useSignUpForm.ts
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { signUpSchema, type SignUpFormData } from '@/utils/authSchema';
import {
  useEmailValidationMutation,
  useSendAuthCodeMutation,
  useVerifyAuthCodeMutation,
  useSignUpMutation
} from '@/query/useAuthQueries';

const AUTH_TIMEOUT = 300;

interface AuthState {
  isEmailVerified: boolean;
  isAuthCodeSent: boolean;
  isAuthCodeVerified: boolean;
  authTimer: number;
}

export const useSignUpForm = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    isEmailVerified: false,
    isAuthCodeSent: false,
    isAuthCodeVerified: false,
    authTimer: 0
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setError,
    clearErrors,
    reset
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
    mode: 'onChange'
  });

  const emailValidationMutation = useEmailValidationMutation();
  const sendAuthCodeMutation = useSendAuthCodeMutation();
  const verifyAuthCodeMutation = useVerifyAuthCodeMutation();
  const signUpMutation = useSignUpMutation();

  // 타이머 관리
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (authState.authTimer > 0) {
      interval = setInterval(() => {
        setAuthState(prev => ({
          ...prev,
          authTimer: prev.authTimer - 1
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authState.authTimer]);

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    const email = watch('email');
    if (!email) return;

    try {
      signUpSchema.validateSyncAt('email', { email });
    } catch {
      return;
    }

    emailValidationMutation.mutate(email, {
      onSuccess: (result) => {
        if (result.isDuplicate) {
          setAuthState(prev => ({ 
            ...prev, 
            isEmailVerified: false,
            isAuthCodeSent: false,
            isAuthCodeVerified: false,
            authTimer: 0
          }));
          setError('email', { 
            type: 'manual', 
            message: '이미 사용 중인 이메일입니다.' 
          });
        } else {
          setAuthState(prev => ({ 
            ...prev, 
            isEmailVerified: true 
          }));
          clearErrors('email');
        }
      },
      onError: (error) => {
        setAuthState(prev => ({ 
          ...prev, 
          isEmailVerified: false 
        }));
        setError('email', { 
          type: 'manual', 
          message: error instanceof Error ? error.message : '이메일 확인 중 오류가 발생했습니다.' 
        });
      }
    });
  };

  // 인증번호 전송
  const handleAuthCodeSend = async () => {
    const email = watch('email');
    if (!email || !authState.isEmailVerified) return;

    sendAuthCodeMutation.mutate(
      { email, isDuplicateEmail: false },
      {
        onSuccess: () => {
          setAuthState(prev => ({
            ...prev,
            isAuthCodeSent: true,
            authTimer: AUTH_TIMEOUT
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

    sendAuthCodeMutation.mutate(
      { email, isDuplicateEmail: false },
      {
        onSuccess: () => {
          setAuthState(prev => ({
            ...prev,
            authTimer: AUTH_TIMEOUT
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
  const onSubmit = async (data: SignUpFormData) => {
    if (!authState.isEmailVerified || !authState.isAuthCodeVerified) {
      return;
    }

    clearErrors(['employeeNumber']);

    const signUpData = {
      email: data.email,
      employeeNumber: data.employeeNumber,
      password: data.password
    };

          signUpMutation.mutate(signUpData, {
        onSuccess: () => {
          reset();
          // 회원가입 성공 시 로그인 페이지로 리다이렉트
        navigate('/login');
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.';
        
        // 사원번호 에러 처리
        if (errorMessage.includes('외부 서버에서 사용자 정보를 찾을 수 없습니다') || 
            errorMessage.includes('사용자 정보를 찾을 수 없습니다')) {
          setError('employeeNumber', {
            type: 'manual',
            message: '사원번호가 일치하지 않습니다.'
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
    if (authState.isAuthCodeSent && authState.authTimer > 0 && !watch('authCode')) return true;
    return sendAuthCodeMutation.isPending || verifyAuthCodeMutation.isPending;
  };

  const isSubmitEnabled = (): boolean => {
    return isValid && authState.isEmailVerified && authState.isAuthCodeVerified && !signUpMutation.isPending;
  };

  const getEmailCheckButtonText = (): string => {
    if (emailValidationMutation.isPending) return '확인 중';
    if (authState.isEmailVerified) return '확인 완료';
    return '중복 확인';
  };

  const isEmailCheckButtonDisabled = (): boolean => {
    const email = watch('email');
    return !email || emailValidationMutation.isPending || authState.isEmailVerified;
  };

  const getSubmitButtonText = (): string => {
    if (signUpMutation.isPending) return '회원가입 중';
    if (signUpMutation.isSuccess) return '회원가입 완료';
    return '회원가입';
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
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
