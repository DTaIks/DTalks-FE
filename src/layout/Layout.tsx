import Sidebar from '@/layout/Sidebar';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  overflow-x: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 250px;
  height: 100vh;                 /* 이 영역이 뷰포트 높이 차지 */
  overflow-y: auto;              /* 이 영역이 스크롤 컨테이너 */
  scrollbar-gutter: stable both-edges; /* 스크롤바 공간 예약 → 레이아웃 쉬프트 방지 */
  overflow-x: hidden;
`;

const ContentArea = styled.div`
  background: var(--color-lightgray-100);
  display: flex;
  flex-direction: column;
  align-items: center;
`; 