import { useState } from 'react';
import styled from "styled-components";
import { useAdminUsers, useAdminUserSearch } from "@/query/useAdminUser";
import UserTableHeader from "@/components/admin/userlist/UserTableHeader";
import UserTableHead from "@/components/admin/userlist/UserTableHead";
import UserTableBody from "@/components/admin/userlist/UserTableBody";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/common/EmptyState";

const UserListTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 7;

  const isSearchMode = !!searchQuery.trim();

  const { 
    data: listResponse, 
    isLoading: isListLoading, 
    isError: isListError 
  } = useAdminUsers({
    pageNumber: currentPage,
    pageSize: pageSize
  });

  const { 
    data: searchResponse, 
    isLoading: isSearchLoading, 
    isError: isSearchError 
  } = useAdminUserSearch({
    name: searchQuery,
    pageNumber: currentPage,
    pageSize: pageSize
  }, isSearchMode);

  // 검색 모드에 따라 사용할 데이터 및 상태 결정
  const response = isSearchMode ? searchResponse : listResponse;
  const isLoading = isSearchMode ? isSearchLoading : isListLoading;
  const isError = isSearchMode ? isSearchError : isListError;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    // 검색어가 실제로 변경된 경우만 처리
    if (query !== searchQuery) {
      setSearchQuery(query);
      setCurrentPage(1); // 검색 시 첫 페이지로 초기화
    }
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return <EmptyState message="사용자 목록을 불러오고 있습니다..." subMessage="잠시만 기다려주세요." />;
    }
    if (isError) {
      return <EmptyState message="접근 권한이 없습니다." subMessage="권한을 확인해주세요." />;
    }
    if (!response?.data?.adminInfoList || response.data.adminInfoList.length === 0) {
      return <EmptyState 
        message={isSearchMode ? "검색 결과가 없습니다." : "등록된 사용자가 없습니다."} 
      />;
    }
    return null;
  };

  const hasData = response?.data?.adminInfoList && response.data.adminInfoList.length > 0;

  const uiPageInfo = response?.data?.pagingInfo ? {
    currentPage: response.data.pagingInfo.currentPageNumber + 1, 
    totalPages: response.data.pagingInfo.totalPageCount
  } : null;

  const emptyState = renderEmptyState();
  if (emptyState) {
    return (
      <TableContainer>
        <UserTableHeader 
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
        {emptyState}
      </TableContainer>
    );
  }

  return (
    <>
      <TableContainer>
        <UserTableHeader 
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
        <Table>
          <UserTableHead />
          <UserTableBody users={response?.data?.adminInfoList || []} />
        </Table>
      </TableContainer>
      {hasData && uiPageInfo && (
        <Pagination 
          currentPage={currentPage}
          totalPages={uiPageInfo.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default UserListTable;

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
