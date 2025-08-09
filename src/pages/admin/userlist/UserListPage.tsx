import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import UserTable from "@/components/admin/userlist/UserListTable";

const UserListPage = () => {
  return (
    <Container>
      <HeaderWrapper>
        <TitleContainer title="사용자 목록" subtitle="등록한 사용자들을 관리하세요" />
      </HeaderWrapper>
      <UserTable />
    </Container>
  );
};

export default UserListPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  position: relative;
  width: 1056px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 32px;
`;
