import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/api/authAPI';
import AppRoutes from '@/routes/Route';
import '@/styles/Global.css';

function App() {
  const { setAuthenticated, setAuthChecking, setUser } = useAuthStore();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 프로필 조회로 인증 상태 확인
        const profile = await authAPI.getProfile();
        setAuthenticated(true);
        // User 타입에 맞게 변환 (id와 email은 임시값 사용)
        setUser({
          id: 'temp-id',
          email: 'temp@email.com',
          name: profile.name,
          employeeNumber: profile.department
        });
      } catch {
        // 인증 실패 시 로그인 상태로 설정
        setAuthenticated(false);
        setUser(null);
      } finally {
        // 인증 확인 완료
        setAuthChecking(false);
      }
    };

    checkAuthStatus();
  }, [setAuthenticated, setAuthChecking, setUser]);

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
