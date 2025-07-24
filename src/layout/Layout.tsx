import Sidebar from './Sidebar';
import Navbar from './Navbar';
import styled from 'styled-components';
import TitleContainer from './TitleContainer';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  title: string;
  subtitle?: string;
}

export default function Layout({ title, subtitle }: LayoutProps) {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <Navbar />
        <TitleContainer title={title} subtitle={subtitle} />
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
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  padding: 32px;
  margin-left: 255px;
  margin-top: 190px;
  background: var(--color-lightgray-100);
`; 