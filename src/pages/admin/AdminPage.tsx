import { Outlet } from 'react-router-dom';
import Sidebar from '../../layout/Sidebar';
import Navbar from '../../layout/Navbar';
import styled from 'styled-components';

export default function AdminPage() {
  return (
    <Wrapper className="page-scale">
      <Sidebar />
      <Main>
        <Navbar />
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--color-lightgray-100);
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  padding: 32px;
  margin-left: 76px;
  margin-top: 292px;
  background: var(--color-lightgray-100);
`; 