import { useState } from 'react';
import styled from "styled-components";
import { useAdminUsers, useAdminUserSearch } from "@/query/useAdminUser";
import UserTableHeader from "@/components/admin/userlist/UserTableHeader";
import UserTableHead from "@/components/admin/userlist/UserTableHead";
import UserTableBody from "@/components/admin/userlist/UserTableBody";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/common/EmptyState";

const UserTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 7;

  const isSearchMode = !!searchQuery.trim();

  // 기본 목록 조회
  const { data: listResponse } = useAdminUsers({
    pageNumber: currentPage,
    pageSize: pageSize
  });

  // 검색 결과 조회
  const { data: searchResponse } = useAdminUserSearch({
    name: searchQuery,
    pageNumber: currentPage,
    pageSize: pageSize
  }, isSearchMode);

  // 검색 모드에 따라 사용할 데이터 결정
  const response = isSearchMode ? searchResponse : listResponse;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 검색 시 첫 페이지로 초기화
  };

  const hasData = response?.data?.adminInfoList && response.data.adminInfoList.length > 0;

  return (
    <>
      <TableContainer>
        <UserTableHeader 
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
        {hasData ? (
          <Table>
            <UserTableHead />
            <UserTableBody users={response.data.adminInfoList} />
          </Table>
        ) : (
          <EmptyState 
            message={isSearchMode ? "검색 결과가 없습니다." : "등록된 사용자가 없습니다."} 
          />
        )}
      </TableContainer>
      {hasData && (
        <Pagination 
          currentPage={currentPage}
          totalPages={response.data.pagingInfo.totalPageCount}
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
