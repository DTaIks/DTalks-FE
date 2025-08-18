import { QueryClient } from '@tanstack/react-query';
import { useDocumentStore } from '@/store/documentStore';
import { useMediaStore } from '@/store/mediaStore';
import { useFAQStore } from '@/store/faqStore';
import { usePermissionStore } from '@/store/permissionStore';
import { useDocumentPageStore } from '@/store/documentPageStore';
import { useCompareStore } from '@/store/compareStore';
import { useLoginStore } from '@/store/loginStore';
import { useArchivedFilesStore } from '@/store/archivedFileStore';
import { useAuthStore } from '@/store/authStore';

/**
 * 로그아웃 시 모든 UI 상태와 데이터 캐시를 무효화하는 통합 함수
 */
export const clearAllData = (queryClient: QueryClient) => {
  // 1. React Query 캐시 초기화
  queryClient.clear();

  // 2. 모든 Zustand 스토어 초기화
  useDocumentStore.getState().resetAll();
  useMediaStore.getState().resetAll();
  useFAQStore.getState().resetAll();
  usePermissionStore.getState().resetPermissionState();
  useDocumentPageStore.getState().resetAll();
  useCompareStore.getState().resetAll();
  useLoginStore.getState().resetForm();
  useArchivedFilesStore.getState().resetAll();
  
  // 3. 인증 스토어는 마지막에 초기화 (다른 스토어들이 참조할 수 있음)
  useAuthStore.getState().logout();

  // 4. 브라우저 저장소 클리어
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (error) {
    console.warn('브라우저 저장소 클리어 실패:', error);
  }

  // 5. 쿠키 클리어 (HttpOnly 쿠키는 서버에서 처리되지만, 클라이언트 쿠키가 있다면 클리어)
  try {
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      }
    });
  } catch (error) {
    console.warn('쿠키 클리어 실패:', error);
  }
};

/**
 * 로그아웃 후 추가 정리 작업
 */
export const performLogoutCleanup = () => {
  // 페이지 새로고침으로 메모리 정리 (선택사항)
  // window.location.reload();
  
  // 또는 특정 경로로 리다이렉트
  window.location.href = '/login';
};
