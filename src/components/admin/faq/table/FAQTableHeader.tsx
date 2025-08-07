import React from "react";
import styled from "styled-components";
import CustomDropdown from "@/components/common/CustomDropdown";

interface FAQTableHeaderProps {
  searchTerm: string;
  selectedCategory: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (value: string) => void;
  categoryOptions: Array<{ value: string; label: string }>;
}

const FAQTableHeader: React.FC<FAQTableHeaderProps> = ({
  searchTerm,
  selectedCategory,
  onSearch,
  onCategoryChange,
  categoryOptions
}) => {
  return (
    <TableHeader>
      <TableTitle>FAQ 목록</TableTitle>
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="질문으로 검색"
          value={searchTerm}
          onChange={onSearch}
        />
        <DropdownContainer>
          <CustomDropdown
            options={categoryOptions}
            value={selectedCategory}
            onChange={onCategoryChange}
          />
        </DropdownContainer>
      </SearchContainer>
    </TableHeader>
  );
};

export default FAQTableHeader;

const TableHeader = styled.div`
  width: 1062px;
  height: 76px;
  border-radius: 19.5px 19.5px 0 0;
  border-bottom: 1.5px solid #E9E0F0;
  background: var(--color-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 44px;
  box-sizing: border-box;
  position: relative;
`;

const TableTitle = styled.h2`
  color: #000;
  font-size: 18px;
  font-weight: 600;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  position: absolute;
  right: 36px;
`;

const DropdownContainer = styled.div`
  margin-left: 12px;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  width: 160px;
  height: 33.75px;
  flex-shrink: 0;
  border-radius: 3.75px;
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