import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import LoginPage from '@/pages/login/LoginPage';
import SignUpPage from '@/pages/signup/SignUpPage';
import PasswordPage from '@/pages/password/PasswordPage';
import UserListPage from '@/pages/admin/userlist/UserListPage';
import PermissionPage from '@/pages/admin/permission/PermissionPage';
import FAQPage from '@/pages/admin/faq/FAQPage';
import FAQCategoryPage from '@/pages/admin/faq/FAQCategoryPage';
import ChartPage from '@/pages/admin/chart/ChartPage';
import MediaPage from '@/pages/admin/media/MediaPage';
import DocumentAllPage from '@/pages/admin/documentAll/DocumentAllPage';
import DocumentPage from '@/pages/admin/document/DocumentPage';
import Layout from '@/layout/Layout';

// 인증이 필요한 라우트
function ProtectedLayout() {
  const { isAuthenticated, isAuthChecking } = useAuthStore();
  
  // 인증 확인 중일 때는 현재 페이지 유지 (Outlet 렌더링)
  if (isAuthChecking) {
    return <Outlet />;
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

// 비로그인만 접근 가능한 라우트
function PublicOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthChecking } = useAuthStore();
  
  // 인증 확인 중일 때는 현재 페이지 유지
  if (isAuthChecking) {
    return <>{children}</>;
  }
  
  return isAuthenticated ? <Navigate to="/admin" replace /> : <>{children}</>;
}

export default function AppRoutes() {
  const { isAuthenticated, isAuthChecking } = useAuthStore();

  return (
    <Routes>
      <Route path="/chart" element={<ChartPage />} />
      {/* 루트 경로: 로그인 상태에 따라 리다이렉트 */}
      <Route path="/" element={
        isAuthChecking ? (
          // 인증 확인 중일 때는 차트 페이지로 (기본 페이지)
          <Navigate to="/admin" replace />
        ) : isAuthenticated ? (
          <Navigate to="/admin" replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/* 비로그인만 접근 */}
      <Route path="/login" element={
        <PublicOnly>
          <LoginPage />
        </PublicOnly>
      } />
      <Route path="/signup" element={
        <PublicOnly>
          <SignUpPage />
        </PublicOnly>
      } />
      <Route path="/password" element={
        <PublicOnly>
          <PasswordPage />
        </PublicOnly>
      } />

      {/* 인증 필요, admin 중첩 라우트 */}
      <Route element={<ProtectedLayout />}>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<ChartPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="permission" element={<PermissionPage />} />
          <Route path="documents" element={<DocumentAllPage />} />
          <Route path="documents/:category" element={<DocumentPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="faqcategory" element={<FAQCategoryPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="settings" element={<ChartPage />} />
        </Route>
      </Route>

      {/* 잘못된 경로는 홈으로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
