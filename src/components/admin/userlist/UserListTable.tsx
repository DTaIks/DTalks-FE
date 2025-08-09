import { useState, useEffect } from 'react';
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

  // 디버깅 로그
  console.log('UserTable 렌더링:', {
    currentPage,
    searchQuery,
    isSearchMode,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    console.log('currentPage 변경됨:', currentPage);
  }, [currentPage]);

  const { data: listResponse } = useAdminUsers({
    pageNumber: currentPage,
    pageSize: pageSize
  });

  const { data: searchResponse } = useAdminUserSearch({
    name: searchQuery,
    pageNumber: currentPage,
    pageSize: pageSize
  }, isSearchMode);

  // 검색 모드에 따라 사용할 데이터 결정
  const response = isSearchMode ? searchResponse : listResponse;

  // 서버 응답 로그
  useEffect(() => {
    if (response?.data?.pagingInfo) {
      console.log('서버 응답 pagingInfo:', response.data.pagingInfo);
    }
  }, [response]);

  const handlePageChange = (page: number) => {
    console.log('handlePageChange 호출:', {
      from: currentPage,
      to: page,
      timestamp: new Date().toISOString()
    });
    
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    console.log('handleSearch 호출:', query);
    console.log('현재 searchQuery:', searchQuery);
    console.log('새로운 query:', query);
    
    // 검색어가 실제로 변경된 경우만 처리
    if (query !== searchQuery) {
      setSearchQuery(query);
      setCurrentPage(1); // 검색 시 첫 페이지로 초기화
    }
  };

  const hasData = response?.data?.adminInfoList && response.data.adminInfoList.length > 0;

  const uiPageInfo = response?.data?.pagingInfo ? {
    currentPage: response.data.pagingInfo.currentPageNumber + 1, 
    totalPages: response.data.pagingInfo.totalPageCount
  } : null;

  console.log('페이지 정보 변환:', {
    serverPageInfo: response?.data?.pagingInfo,
    uiPageInfo,
    currentPageState: currentPage
  });

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
