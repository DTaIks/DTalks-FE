import styled from "styled-components";
import { useUserStore } from "@/store/userStore";
import UserSearchHeader from "@/components/admin/userlist/UserSearchHeader";
import UserTableHead from "@/components/admin/userlist/UserTableHead";
import UserTableBody from "@/components/admin/userlist/UserTableBody";

const UserTable = () => {
  const { currentPage, getFilteredData } = useUserStore();
  const { paginatedData } = getFilteredData(currentPage, 5);

  return (
    <>
      <UserSearchHeader />
      <TableContainer>
        <Table>
          <UserTableHead />
          <UserTableBody users={paginatedData} />
        </Table>
      </TableContainer>
    </>
  );
};

export default UserTable;

const TableContainer = styled.div`
  width: 1062px;
  margin: 0 auto 12px auto;
  background: var(--color-white);
  border-radius: var(--br-18);
  box-shadow: 0px 0px 11.25px 2.25px rgba(153, 102, 204, 0.05);
  overflow: hidden;
  padding-bottom: 32px;
  max-height: 586px;
`;

const Table = styled.div`
  width: 100%;
`; 
