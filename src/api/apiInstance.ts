import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';

// API 인스턴스 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dtalks.kro.kr/';

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
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터: 401 시 전역 로그아웃으로 상태 동기화
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      if (status === 401) {
        try {
          const { logout } = useAuthStore.getState();
          logout();
        } catch (error) {
          console.error('로그아웃 처리 중 오류:', error);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// API 인스턴스 생성
export const apiInstance = createAxiosInstance();