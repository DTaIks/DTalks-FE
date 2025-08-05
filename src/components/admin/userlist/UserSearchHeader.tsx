
import styled from "styled-components";
import { useUserStore } from "@/store/userStore";
import type { ChangeEvent } from "react";

const UserSearchHeader = () => {
  const { searchTerm, setSearchTerm } = useUserStore();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <SearchContainerOutside>
      <SearchInput 
        placeholder="이름으로 검색" 
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </SearchContainerOutside>
  );
};

export default UserSearchHeader;

const SearchInput = styled.input`
  border-radius: var(--br-8);
  border: 0.75px solid var(--color-darkgray);
  width: 180px;
  height: 33.75px;
  padding: 0 15px;
  font-size: 15px;
  color: var(--color-darkgray);
  box-sizing: border-box;
  outline: none;
  margin-left: 10px;
`;

const SearchContainerOutside = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 989.33px;
  margin: 0 auto 16px auto;
  margin-left: 72px;
`; 