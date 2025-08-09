import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API 인스턴스 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://210.109.83.190:8080';

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
      console.log('Request:', config.method?.toUpperCase(), config.url);
      console.log('Request Headers:', config.headers);
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터: AxiosError를 그대로 전달해 디버깅 정보(error.response)를 보존
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => Promise.reject(error)
  );

  return instance;
};

// API 인스턴스 생성
export const apiInstance = createAxiosInstance();
