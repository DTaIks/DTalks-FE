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
  overflow-y: auto;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  margin-left: 316px;
  margin-top: 140px;
  background: var(--color-lightgray-100);
`; 