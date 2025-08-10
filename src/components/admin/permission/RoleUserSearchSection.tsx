import styled from 'styled-components';
import UserTable from '@/components/admin/permission/RoleUserTable';
import Pagination from '@/components/common/Pagination';

interface TableDataItem {
  userId: number;
  name: string;
  email: string;
  department: string;
  role: string;
}

interface UserSearchSectionProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  error: Error | null;
  tableData: TableDataItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isSearchMode: boolean;
}

export const UserSearchSection = ({
  searchTerm,
  onSearchChange,
  isLoading,
  error,
  tableData,
  currentPage,
  totalPages,
  onPageChange,
  isSearchMode
}: UserSearchSectionProps) => {
  const tableHeaders = ['이름', '이메일', '부서', '역할'];

  return (
    <ModalSection2>
      <ModalSection2Header>
        <HeaderTitle>사용자 검색</HeaderTitle>
        <SearchInput 
          placeholder="사용자를 검색하세요" 
          value={searchTerm}
          onChange={onSearchChange}
        />
      </ModalSection2Header>
      
      {isLoading && (
        <LoadingContainer>
          <LoadingText>데이터를 불러오는 중...</LoadingText>
        </LoadingContainer>
      )}
      
      {error && (
        <ErrorContainer>
          <ErrorText>데이터를 불러오는데 실패했습니다: {error.message}</ErrorText>
        </ErrorContainer>
      )}
      
      {!isLoading && !error && tableData.length === 0 && (
        <EmptyContainer>
          <EmptyText>
            {isSearchMode ? '검색 결과가 없습니다.' : '사용자 데이터가 없습니다.'}
          </EmptyText>
        </EmptyContainer>
      )}
      
      {!isLoading && !error && tableData.length > 0 && (
        <TableSection>
          <UserTable 
            tableHeaders={tableHeaders} 
            tableData={tableData}
          />
          <PaginationWrapper>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </PaginationWrapper>
        </TableSection>
      )}
    </ModalSection2>
  );
};

const ModalSection2 = styled.div`
  width: 796.5px;
  height: 400px;
  flex-shrink: 0;
  border-radius: 18px;
  border: 1.5px solid #E9E9E9;
  margin-left: 36px;
  display: flex;
  flex-direction: column;
`;

const ModalSection2Header = styled.div`
  width: 796.5px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 18.75px 18.75px 0 0;
  border-bottom: 1.5px solid #E9E9E9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 36px;
  padding-right: 36px;
  box-sizing: border-box;
`;

const HeaderTitle = styled.span`
  color: #000;
  font-size: 16.5px;
  font-weight: 500;
`;

const SearchInput = styled.input`
  width: 200px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 3.75px;
  border: 0.75px solid #666;
  padding: 0 12px;
  font-family: var(--font-pretendard);
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #999;
  }
`;

const TableSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PaginationWrapper = styled.div`
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingText = styled.span`
  color: #666;
  font-size: 14px;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ErrorText = styled.span`
  color: #e74c3c;
  font-size: 14px;
`;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyText = styled.span`
  color: #999;
  font-size: 14px;
`;
