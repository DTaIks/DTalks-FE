import styled from "styled-components";
import type { ChangeEvent } from "react";
import { useUserStore } from "@/store/userStore";

const UserTableHeader = () => {
  const { searchTerm, setSearchTerm } = useUserStore();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <TableHeader>
      <TableTitle>사용자 목록</TableTitle>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="사용자를 검색하세요"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchContainer>
    </TableHeader>
  );
};

export default UserTableHeader;

const TableHeader = styled.div`
  width: 1062px;
  height: 76px;
  border-radius: 19.5px 19.5px 0 0;
  border-bottom: 1.5px solid #E9E0F0;
  background: var(--color-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  box-sizing: border-box;
  position: relative;
`;

const TableTitle = styled.h2`
  color: var(--color-black);
  font-size: var(--font-size-18);
  font-weight: 600;
  margin: 0;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchInput = styled.input`
  width: 180px;
  height: 32px;
  border-radius: 4px;
  border: 0.75px solid #CCC;
  padding: 0 12px;
  font-size: 14px;
  color: #000;
  background: #FFF;
  outline: none;
  box-sizing: border-box;
  
  &::placeholder {
    color: #999;
  }
`; 