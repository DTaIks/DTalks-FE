import styled from "styled-components";
import UserTable from "../../../components/admin/userlist/UserListTable";
import Pagination from "../../../components/common/Pagination";

const UserListPage = () => {
  return (
    <Container>
      <UserTable />
      <Pagination />
    </Container>
  );
};

export default UserListPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
