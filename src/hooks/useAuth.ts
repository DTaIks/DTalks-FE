import { useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useLoginStore } from '@/store/loginStore';
import { authAPI } from '@/api/authAPI';
import { useLocation } from 'react-router-dom';
import { hasAuthCookie } from '@/utils/cookieUtils';

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
  
  const { setError: setLoginError } = useLoginStore();
  
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
      setLoginError(null); // 로그인 성공 시 에러 초기화
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
      setLoading(false);
      setAuthChecking(false);
      setError(errorMessage);
      setLoginError(errorMessage); // 로그인 에러도 설정
    },
  });
};

// 로그아웃 관련 함수는 useAuthQueries.ts의 useLogoutMutation과 logoutUtils.ts로 이동됨

// 백그라운드 인증 확인
export const useAuth = () => {
  const { reissueToken, setAuthenticated, setAuthChecking } = useAuthStore();
  const location = useLocation();
  const isCheckingRef = useRef(false);
  const hasCheckedRef = useRef(false);
  const initialCheckDoneRef = useRef(false);

  useEffect(() => {
    // 초기 페이지 로딩 시 쿠키 기반 인증 상태 확인
    if (!initialCheckDoneRef.current) {
      initialCheckDoneRef.current = true;
      
      // 쿠키에 인증 정보가 있는지 확인
      const hasCookie = hasAuthCookie();
      
      if (hasCookie) {
        // 쿠키가 있으면 토큰 재발급 시도
        const checkAuthWithCookie = async () => {
          isCheckingRef.current = true;
          
          try {
            await reissueToken();
            setAuthenticated(true);
            setAuthChecking(false);
            hasCheckedRef.current = true;
          } catch {
            setAuthenticated(false);
            setAuthChecking(false);
            hasCheckedRef.current = true;
          } finally {
            isCheckingRef.current = false;
          }
        };
        
        checkAuthWithCookie();
      } else {
        // 쿠키가 없으면 인증되지 않은 상태로 설정
        setAuthenticated(false);
        setAuthChecking(false);
      }
      
      return;
    }

    // 공개 페이지 목록 (토큰 재발급 불필요)
    const publicPages = ['/login', '/signup', '/password'];
    
    // 이미 인증 확인 중이거나 공개 페이지이면 실행하지 않음
    if (isCheckingRef.current || publicPages.includes(location.pathname)) {
      return;
    }

    // 이미 한 번 확인했다면 다시 확인하지 않음 (개발 환경에서 중복 방지)
    if (hasCheckedRef.current && process.env.NODE_ENV === 'development') {
      return;
    }

    const checkAuthInBackground = async () => {
      isCheckingRef.current = true;
      
      try {
        await reissueToken();
        setAuthenticated(true);
        hasCheckedRef.current = true;
        // 인증 성공 시에도 isAuthChecking을 true로 유지하여 현재 페이지 보호
        // setAuthChecking(false) 호출하지 않음
      } catch {
        setAuthenticated(false);
        hasCheckedRef.current = true;
        // 인증 실패 시에만 setAuthChecking(false) 호출
        setAuthChecking(false);
      } finally {
        isCheckingRef.current = false;
      }
    };

    checkAuthInBackground();
  }, [location.pathname, reissueToken, setAuthenticated, setAuthChecking]); // location.pathname 의존성 추가하여 페이지 변경 시 재확인
};
