import styled from "styled-components";
import Navbar from "../../layout/Navbar";
import Sidebar from "../../layout/Sidebar";
import UserTitleContainer from "../../layout/TitleContainer";
import Pagination from "../../components/dashboard/Pagination";
import UserTable from "../../components/dashboard/UserTable";

const Container = styled.div`
  width: 100%;
  position: relative;
  background-color: var(--color-ghostwhite);
  min-height: 3041px;
  overflow: hidden;
  text-align: left;
  font-size: var(--font-size-24);
  color: var(--color-black);
  font-family: var(--font-pretendard);
`;

const UserListPage = () => {
  return (
    <Container className="user-list-page">
      <Navbar />
      <Sidebar />
      <UserTitleContainer />
      <UserTable />
      <Pagination />
    </Container>
  );
};

export default UserListPage;
