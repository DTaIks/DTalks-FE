import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/api/authAPI';

// 이메일 중복 확인
export const useEmailValidationMutation = () => {
  return useMutation({
    mutationFn: (email: string) => authAPI.validateEmail(email),
    onError: (error) => {
      console.error('이메일 중복 확인 실패:', error);
    }
  });
};

// 인증번호 전송
export const useSendAuthCodeMutation = () => {
  return useMutation({
    mutationFn: ({ email, isDuplicateEmail }: { email: string; isDuplicateEmail: boolean }) => 
      authAPI.sendAuthCode(email, isDuplicateEmail),
    onError: (error) => {
      console.error('인증번호 전송 실패:', error);
    }
  });
};

// 인증번호 확인
export const useVerifyAuthCodeMutation = () => {
  return useMutation({
    mutationFn: ({ email, verificationNumber }: { email: string; verificationNumber: string }) => 
      authAPI.verifyAuthCode(email, verificationNumber),
    onError: (error) => {
      console.error('인증번호 확인 실패:', error);
    }
  });
};

// 회원가입
export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; employeeNumber: string; password: string }) => 
      authAPI.signUp(data),
    onError: (error) => {
      console.error('회원가입 실패:', error);
    }
  });
};
