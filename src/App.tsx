import AppRoutes from '@/routes/Route';
import '@/styles/Global.css';
import { useAuth } from '@/hooks/useAuth';

function App() {
  // 새로고침 시 토큰 재발급 시도
  useAuth();

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
