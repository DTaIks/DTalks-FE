import AppRoutes from '@/routes/Route';
import '@/styles/Global.css';
// 초기 세션 확인은 호출하지 않음 (쿠키 자동 첨부 + 로컬 복원)

function App() {
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
