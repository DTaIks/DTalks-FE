import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '@/App';

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true, // 마운트 시 자동 리페치 활성화 (뮤테이션 후 무효화를 위해)
      refetchOnReconnect: false, // 재연결 시 자동 리페치 비활성화
      staleTime: 1000 * 60 * 10, // 10분 (더 길게 설정)
      gcTime: 1000 * 60 * 30, // 30분 (더 길게 설정)
      placeholderData: (previousData: unknown) => previousData, // 이전 데이터를 placeholder로 사용
    },
    mutations: {
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
