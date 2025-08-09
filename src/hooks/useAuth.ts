import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/api/authAPI';

// 이메일 중복 확인
// export const useCheckEmailDuplicate = (email: string) => {
//   return useQuery({
//     queryKey: ['email-duplicate', email],
//     queryFn: () => authAPI.checkEmailDuplicate(email),
//     enabled: !!email && email.includes('@'),
//     staleTime: 1000 * 60 * 5, // 5분
//   });
// };

// 인증번호 발송
// export const useSendAuthCode = () => {
//   return useMutation({
//     mutationFn: (email: string) => authAPI.sendAuthCode(email),
//     onSuccess: () => {
//       console.log('인증번호가 발송되었습니다.');
//     },
//     onError: (error) => {
//       console.error('인증번호 발송 실패:', error);
//     },
//   });
// };

// 인증번호 확인
// export const useVerifyAuthCode = () => {
//   return useMutation({
//     mutationFn: ({ email, code }: { email: string; code: string }) =>
//       authAPI.verifyAuthCode(email, code),
//     onSuccess: () => {
//       console.log('인증번호가 확인되었습니다.');
//     },
//     onError: (error) => {
//       console.error('인증번호 확인 실패:', error);
//     },
//   });
// };

// 로그인
export const useLogin = () => {
  const { setAuthenticated, setLoading, setError, setAccessToken, setRefreshToken } = useAuthStore();
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.login({ email, password }),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      if (data?.accessToken) setAccessToken(data.accessToken);
      if (data?.refreshToken) setRefreshToken(data.refreshToken);
      setAuthenticated(true);
      setLoading(false);
      setError(null);
    },
    onError: (error: any) => {
      setLoading(false);
      setError(error.message || '로그인에 실패했습니다.');
      console.error('로그인 실패:', error);
    },
  });
};

// 회원가입
// export const useSignup = () => {
//   const { setUser, setAuthenticated, setLoading, setError } = useAuthStore();
  
//   return useMutation({
//     mutationFn: (userData: {
//       email: string;
//       password: string;
//       employeeNumber: string;
//       authCode: string;
//     }) => authAPI.signup(userData),
//     onMutate: () => {
//       setLoading(true);
//       setError(null);
//     },
//     onSuccess: (data) => {
//       // 성공 시 Zustand store 업데이트
//       setUser(data.user);
//       setAuthenticated(true);
//       setLoading(false);
//       setError(null);
//     },
//     onError: (error: any) => {
//       setLoading(false);
//       setError(error.message || '회원가입에 실패했습니다.');
//       console.error('회원가입 실패:', error);
//     },
//   });
// };

// 로그아웃 (쿠키 기반)
export const useLogout = () => {
  const { logout, setError } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await authAPI.logout();
    },
    onSuccess: () => {
      logout();
    },
    onError: (error: any) => {
      console.error('로그아웃 실패:', error);
      // 실패해도 로컬은 초기화하여 세션 끊김 상태 유지 권장 시 아래 주석 해제
      // logout();
      setError(error.message || '로그아웃에 실패했습니다.');
    },
  });
};

// 토큰 갱신
// export const useRefreshToken = () => {
//   return useMutation({
//     mutationFn: () => authAPI.refreshToken(),
//     onError: (error) => {
//       console.error('토큰 갱신 실패:', error);
//     },
//   });
// };

// 현재 사용자 정보 가져오기
// export const useGetCurrentUser = () => {
//   const { setUser, setAuthenticated } = useAuthStore();
  
//   return useQuery({
//     queryKey: ['current-user'],
//     queryFn: () => authAPI.getCurrentUser(),
//     onSuccess: (data) => {
//       setUser(data);
//       setAuthenticated(true);
//     },
//     onError: () => {
//       // 토큰이 유효하지 않으면 로그아웃 처리
//       setUser(null);
//       setAuthenticated(false);
//     },
//   });
// };

// 토큰 유효성 확인
// export const useValidateToken = () => {
//   return useQuery({
//     queryKey: ['validate-token'],
//     queryFn: () => authAPI.validateToken(),
//     staleTime: 1000 * 60 * 5, // 5분
//   });
// }; 