import { useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/api/authAPI';
import { useLocation } from 'react-router-dom';

// 이메일 중복 확인
export const useCheckEmailDuplicate = (email: string) => {
  return useQuery({
    queryKey: ['email-duplicate', email],
    queryFn: () => authAPI.validateEmail(email),
    enabled: !!email && email.includes('@'),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 로그인
export const useLogin = () => {
  const { 
    setAuthenticated, 
    setLoading, 
    setError, 
    setAccessToken, 
    setRefreshToken, 
    setAuthChecking 
  } = useAuthStore();
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.login({ email, password }),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      // 쿠키 기반 인증이므로 토큰은 백업용으로만 저장
      if (data?.accessToken) setAccessToken(data.accessToken);
      if (data?.refreshToken) setRefreshToken(data.refreshToken);
      
      setAuthenticated(true);
      setAuthChecking(false);
      setLoading(false);
      setError(null);
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
      setLoading(false);
      setAuthChecking(false);
      setError(errorMessage);
    },
  });
};

// 로그아웃
export const useLogout = () => {
  const { logout, setError } = useAuthStore();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      logout();
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : '로그아웃에 실패했습니다.';
      setError(errorMessage);
    },
  });
};

// 백그라운드 인증 확인
export const useAuth = () => {
  const { reissueToken, setAuthenticated, setAuthChecking } = useAuthStore();
  const location = useLocation();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // 이미 인증 확인을 완료했거나 로그인 페이지이면 실행하지 않음
    if (hasCheckedAuth.current || location.pathname === '/login') {
      setAuthChecking(false);
      return;
    }

    const checkAuthInBackground = async () => {
      try {
        await reissueToken();
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      } finally {
        setAuthChecking(false);
        hasCheckedAuth.current = true;
      }
    };

    checkAuthInBackground();
  }, [reissueToken, setAuthenticated, setAuthChecking, location.pathname]);
};
