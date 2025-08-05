import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import UserTable from "@/components/admin/userlist/UserListTable";
import Pagination from "@/components/common/Pagination";
import { useUserStore } from "@/store/userStore";

const UserListPage = () => {
  const {
    currentPage,
    setCurrentPage,
    getFilteredData
  } = useUserStore();

  const { totalPages } = getFilteredData(currentPage, 5);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container>
      <TitleContainer title="사용자 목록" subtitle="등록한 사용자들을 관리하세요" />
      <UserTable />
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </Container>
  );
};

export default UserListPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
