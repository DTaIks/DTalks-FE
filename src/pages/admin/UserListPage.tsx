import styled from "styled-components";
import UserTable from "../../components/admin/UserTable";
import Pagination from "../../components/admin/Pagination";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const UserListPage = () => {
  return (
    <Container>
      <UserTable />
      <Pagination />
    </Container>
  );
};

export default UserListPage;
