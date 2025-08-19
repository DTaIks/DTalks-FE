import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';

// 로그아웃 처리 중인지 확인하는 플래그
let isLoggingOut = false;

// API 인스턴스 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dtalks.kro.kr/';
const AI_API_BASE_URL = import.meta.env.VITE_AI_API_URL || 'http://ai.dtalks.o-r.kr';

// 공개 API 목록 (인증 불필요, but 쿠키는 받아야 하는 API들)
const PUBLIC_APIS_WITH_COOKIES = [
  '/admin/auth/login',  // 로그인은 쿠키를 받아야 함
];

// 공개 API 목록 (인증 불필요, 쿠키도 받지 않는 API들)
const PUBLIC_APIS_WITHOUT_COOKIES = [
  '/admin/auth/join',
  '/admin/email/validation',
  '/admin/email/send',
  '/admin/email/verification',
  '/admin/auth/password/reset'
];

// axios 인스턴스 생성
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true, // 쿠키 포함
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    (config) => {
      // 쿠키를 받지 않는 공개 API인 경우 withCredentials를 false로 설정
      if (PUBLIC_APIS_WITHOUT_COOKIES.some(api => config.url?.includes(api))) {
        config.withCredentials = false;
      }
      // 나머지는 withCredentials: true로 설정 (쿠키 포함)
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터: 401 시 토큰 재발급 시도 후 실패 시 로그아웃
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const url = error.config?.url;
      
      // 401 에러이고 토큰 재발급 API가 아닌 경우에만 토큰 재발급 시도
      if (status === 401 && url && !isLoggingOut && !PUBLIC_APIS_WITH_COOKIES.some(api => url.includes(api)) && !PUBLIC_APIS_WITHOUT_COOKIES.some(api => url.includes(api)) && !url.includes('/admin/auth/reissue')) {
        try {
          isLoggingOut = true;
          const { reissueToken } = useAuthStore.getState();
          
          // 토큰 재발급 시도
          await reissueToken();
          
          // 토큰 재발급 성공 시 원래 요청 재시도
          if (error.config) {
            return apiInstance.request(error.config);
          }
        } catch (reissueError) {
          // 토큰 재발급 실패 시 로그아웃
          console.error('토큰 재발급 실패:', reissueError);
          const { logout } = useAuthStore.getState();
          logout();
        } 
        finally {
          isLoggingOut = false;
        }
      } else if ((status === 410) && url && !isLoggingOut && !PUBLIC_APIS_WITH_COOKIES.some(api => url.includes(api)) && !PUBLIC_APIS_WITHOUT_COOKIES.some(api => url.includes(api))) {
        // 410 에러는 바로 로그아웃 (세션 만료)
        try {
          isLoggingOut = true;
          const { logout } = useAuthStore.getState();
          logout();
        } catch (logoutError) {
          console.error('로그아웃 처리 중 오류:', logoutError);
        } finally {
          isLoggingOut = false;
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// AI API 전용 axios 인스턴스 생성
const createAIAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: AI_API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // AI API용 응답 인터셉터
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiInstance = createAxiosInstance();
export const aiApiInstance = createAIAxiosInstance();
