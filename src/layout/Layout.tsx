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
  overflow-x: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 250px;
`;

const ContentArea = styled.div`
  margin-top: 140px;
  background: var(--color-lightgray-100);
  display: flex;
  flex-direction: column;
  align-items: center;
`; 