import React from "react";
import styled from "styled-components";
import CustomDropdown from "@/components/common/CustomDropdown";

interface TableHeaderProps {
  title: string;
  searchTerm: string;
  selectedStatus: string;
  selectedCategory?: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange?: (value: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  searchTerm,
  selectedStatus,
  selectedCategory,
  onSearchChange,
  onStatusChange,
  onCategoryChange
}) => {
  const statusOptions = [
    { value: "전체 상태", label: "전체 상태" },
    { value: "활성", label: "활성" },
    { value: "비활성", label: "비활성" }
  ];

  const categoryOptions = [
    { value: "전체 카테고리", label: "전체 카테고리" },
    { value: "용어 사전", label: "용어 사전" },
    { value: "사내 정책", label: "사내 정책" },
    { value: "보고서 양식", label: "보고서 양식" },
  ];

  return (
    <Header>
      <TableTitle>{title}</TableTitle>
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="문서명으로 검색"
          value={searchTerm}
          onChange={onSearchChange}
        />
        {onCategoryChange && (
          <DropdownContainer>
            <CustomDropdown
              options={categoryOptions}
              value={selectedCategory || ""}
              onChange={onCategoryChange}
            />
          </DropdownContainer>
        )}
        <DropdownContainer>
          <CustomDropdown
            options={statusOptions}
            value={selectedStatus}
            onChange={onStatusChange}
          />
        </DropdownContainer>
      </SearchContainer>
    </Header>
  );
};

export default TableHeader;

const Header = styled.div`
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
