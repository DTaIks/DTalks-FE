import styled from "styled-components";
import { useUserStore } from "@/store/userStore";
import UserTableHeader from "@/components/admin/userlist/UserTableHeader";
import UserTableHead from "@/components/admin/userlist/UserTableHead";
import UserTableBody from "@/components/admin/userlist/UserTableBody";
import Pagination from "@/components/common/Pagination";

const UserTable = () => {
  const { currentPage, setCurrentPage, getFilteredData } = useUserStore();
  const { paginatedData, totalPages } = getFilteredData(currentPage, 8);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <TableContainer>
        <UserTableHeader />
        <Table>
          <UserTableHead />
          <UserTableBody users={paginatedData} />
        </Table>
      </TableContainer>
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
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
`;

const Table = styled.div`
  width: 100%;
`; 
