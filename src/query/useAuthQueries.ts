import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/api/authAPI';
import { clearAllData } from '@/utils/logoutUtils';

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

// 비밀번호 재설정
export const usePasswordResetMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; newPassword: string; verificationCode: string }) => 
      authAPI.resetPassword(data),
    onError: (error) => {
      console.error('비밀번호 재설정 실패:', error);
    }
  });
};

// 로그아웃
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      // 로그아웃 성공 시 모든 UI 상태와 데이터 캐시 무효화
      clearAllData(queryClient);
    },
    onError: (error) => {
      console.error('로그아웃 실패:', error);
      // 에러가 발생해도 로컬 상태는 초기화 (보안상 중요)
      clearAllData(queryClient);
    }
  });
};
