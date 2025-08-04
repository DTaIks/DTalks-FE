import React from "react";
import styled from "styled-components";
import CustomDropdown from "../../common/CustomDropdown";

interface DocumentTableProps {
  currentPage: number;
  itemsPerPage: number;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ currentPage, itemsPerPage }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Search:', e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    console.log('Category:', value);
  };

  const handleStatusChange = (value: string) => {
    console.log('Status:', value);
  };

  // 컬럼 헤더 내용 배열
  const columnHeaders = ['문서명', '카테고리', '버전', '작성자', '최종수정일', '상태', '작업'];

  return (
    <>
      <TableContainer>
        <TableHeader>
          <TableTitle>문서 목록</TableTitle>
          <SearchContainer>
            <SearchInput 
              type="text" 
              placeholder="문서명으로 검색"
              onChange={handleSearch}
            />
            <DropdownContainer>
              <CustomDropdown
                options={[
                  { value: "", label: "전체 카테고리" },
                  { value: "policy", label: "사내 규정" },
                  { value: "manual", label: "매뉴얼" },
                  { value: "form", label: "양식" }
                ]}
                value=""
                onChange={handleCategoryChange}
              />
            </DropdownContainer>
            <DropdownContainer>
              <CustomDropdown
                options={[
                  { value: "", label: "전체 상태" },
                  { value: "active", label: "활성" },
                  { value: "inactive", label: "비활성" },
                  { value: "archived", label: "보관" }
                ]}
                value=""
                onChange={handleStatusChange}
              />
            </DropdownContainer>
          </SearchContainer>
        </TableHeader>
        <Table>
          <TableHead>
            <TableRow>
              {columnHeaders.map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* 문서 목록이 여기에 들어갈 예정 */}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DocumentTable;

const TableContainer = styled.div`
  width: 1062px;
  border-radius: var(--br-18);
  background: var(--color-white);
  box-shadow: 0 6px 18px 0 rgba(125, 93, 246, 0.10);
  transition: height 0.3s ease;
`;

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

const Table = styled.div`
  width: 100%;
`;

const TableHead = styled.div`
  height: 60px;
  border-bottom: 1.5px solid #E9E0F0;
  background: #FFF;
  display: flex;
  align-items: center;
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 56px;
  padding-top: 28px;
`;

const TableRow = styled.div`
  width: 1062px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
  padding-left: 36px;
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #2D1457;
  font-size: var(--font-size-16);
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  
  &:nth-child(1) { width: 15%; }
  &:nth-child(2) { width: 15%; }
  &:nth-child(3) { width: 15%; }
  &:nth-child(4) { width: 15%; }
  &:nth-child(5) { width: 26%; }
  &:nth-child(6) { width: 12%; }
  &:nth-child(7) { width: 12%; }
`;

const TableTitle = styled.h2`
  color: #000;
  font-size: 18px;
  font-weight: 600;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
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