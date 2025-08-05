import React from "react";
import styled from "styled-components";
import CustomDropdown from "@/components/common/CustomDropdown";

interface DocumentTableHeaderProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (value: string) => void;
}

const DocumentTableHeader: React.FC<DocumentTableHeaderProps> = ({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange
}) => {
  const categoryOptions = [
    { value: "", label: "전체 카테고리" },
    { value: "policy", label: "사내 규정" },
    { value: "manual", label: "매뉴얼" },
    { value: "dictionary", label: "용어사전" }
  ];

  return (
    <TableHeader>
      <TableTitle>문서 목록</TableTitle>
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="문서명으로 검색"
          value={searchTerm}
          onChange={onSearchChange}
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

export default DocumentTableHeader;

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
  color: #000;
  font-size: 18px;
  font-weight: 700;
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