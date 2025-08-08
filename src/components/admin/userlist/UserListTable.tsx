import styled from "styled-components";
import { useUserStore } from "@/store/userStore";
import UserTableHeader from "@/components/admin/userlist/UserTableHeader";
import UserTableHead from "@/components/admin/userlist/UserTableHead";
import UserTableBody from "@/components/admin/userlist/UserTableBody";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/common/EmptyState";

const UserTable = () => {
  const { currentPage, setCurrentPage, getFilteredData } = useUserStore();
  const { paginatedData, totalPages } = getFilteredData(currentPage, 7);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <TableContainer>
        <UserTableHeader />
        {paginatedData.length > 0 ? (
          <Table>
            <UserTableHead />
            <UserTableBody users={paginatedData} />
          </Table>
        ) : (
          <EmptyState />
        )}
      </TableContainer>
      {paginatedData.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}
    </>
  );
};

export default UserTable;

const TableContainer = styled.div`
  width: 1062px;
  border-radius: var(--br-18);
  background: var(--color-white);
  box-shadow: 0 6px 18px 0 rgba(125, 93, 246, 0.10);
  transition: height 0.3s ease;
  padding-bottom: 32px;
`;

const Table = styled.div`
  width: 100%;
`; 
