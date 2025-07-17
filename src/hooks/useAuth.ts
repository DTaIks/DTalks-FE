import { useMutation, useQuery } from '@tanstack/react-query';
import { authAPI } from '../api/authAPI';
import { useAuthStore } from '../store/authStore';

// 이메일 중복 확인
export const useCheckEmailDuplicate = (email: string) => {
  return useQuery({
    queryKey: ['email-duplicate', email],
    queryFn: () => authAPI.checkEmailDuplicate(email),
    enabled: !!email && email.includes('@'),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 인증번호 발송
export const useSendAuthCode = () => {
  return useMutation({
    mutationFn: (email: string) => authAPI.sendAuthCode(email),
    onSuccess: () => {
      console.log('인증번호가 발송되었습니다.');
    },
    onError: (error) => {
      console.error('인증번호 발송 실패:', error);
    },
  });
};

// 인증번호 확인
export const useVerifyAuthCode = () => {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      authAPI.verifyAuthCode(email, code),
    onSuccess: () => {
      console.log('인증번호가 확인되었습니다.');
    },
    onError: (error) => {
      console.error('인증번호 확인 실패:', error);
    },
  });
};

// 로그인
export const useLogin = () => {
  const { login } = useAuthStore();
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.login({ email, password }),
    onSuccess: (data) => {
      // Zustand store 업데이트
      login(data.user.email, 'password'); // 실제로는 토큰을 사용
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
    },
  });
};

// 회원가입
export const useSignup = () => {
  const { signup } = useAuthStore();
  
  return useMutation({
    mutationFn: (userData: {
      email: string;
      password: string;
      employeeNumber: string;
      authCode: string;
    }) => authAPI.signup(userData),
    onSuccess: (data) => {
      // Zustand store 업데이트
      signup({
        email: data.user.email,
        password: 'password', // 실제로는 토큰을 사용
        employeeNumber: data.user.employeeNumber || '',
      });
    },
    onError: (error) => {
      console.error('회원가입 실패:', error);
    },
  });
};

// 로그아웃
export const useLogout = () => {
  const { logout } = useAuthStore();
  
  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      // Zustand store 업데이트
      logout();
    },
    onError: (error) => {
      console.error('로그아웃 실패:', error);
      // 에러가 있어도 로컬 상태는 초기화
      logout();
    },
  });
}; 