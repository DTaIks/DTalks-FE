import { Outlet } from 'react-router-dom';
import Sidebar from '../../layout/Sidebar';
import Navbar from '../../layout/Navbar';
import styled from 'styled-components';

export default function AdminPage() {
  return (
    <>
      <Sidebar />
      <Wrapper>
        <Main>
          <Navbar />
          <Content>
            <Outlet />
          </Content>
        </Main>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  background: var(--color-lightgray-100);
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 400px;
`;

const Content = styled.div`
  padding: 32px;
  margin-left: 76px;
  margin-top: 292px;
  background: var(--color-lightgray-100);
`; 