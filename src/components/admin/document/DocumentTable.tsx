import React from "react";
import styled from "styled-components";
import CustomDropdown from "../../common/CustomDropdown";
import DropDownButton from "../../common/DropDownButton";
import { useDocumentData } from "../../../hooks/document/useDocumentData";

interface DocumentTableProps {
  currentPage: number;
  itemsPerPage: number;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ currentPage, itemsPerPage }) => {
  const {
    searchTerm,
    selectedCategory,
    selectedStatus,
    handleSearch,
    handleCategoryChange,
    handleStatusChange,
    handleArchive,
    handleDownload,
    handleVersionManage,
    getFilteredData,
    categoryOptions,
    statusOptions,
    columnHeaders
  } = useDocumentData();

  const { paginatedData } = getFilteredData(currentPage, itemsPerPage);

  return (
    <>
      <TableContainer>
        <TableHeader>
          <TableTitle>문서 목록</TableTitle>
          <SearchContainer>
            <SearchInput 
              type="text" 
              placeholder="문서명으로 검색"
              value={searchTerm}
              onChange={handleSearch}
            />
            <DropdownContainer>
              <CustomDropdown
                options={categoryOptions}
                value={selectedCategory}
                onChange={handleCategoryChange}
              />
            </DropdownContainer>
            <DropdownContainer>
              <CustomDropdown
                options={statusOptions}
                value={selectedStatus}
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
            {paginatedData.map((document) => (
              <TableRow key={document.id}>
                <TableCell>
                  <DocumentName>{document.name}</DocumentName>
                </TableCell>
                <TableCell>
                  <CategoryImage src={document.categoryImage} alt={document.category} />
                </TableCell>
                <TableCell>
                  <VersionText>{document.version}</VersionText>
                </TableCell>
                <TableCell>
                  <AuthorText>{document.author}</AuthorText>
                </TableCell>
                <TableCell>
                  <DateText>{document.lastModified}</DateText>
                </TableCell>
                <TableCell>
                  <StatusIcon src={document.statusIcon} alt={document.status} />
                </TableCell>
                <TableCell>
                  <DropDownButton 
                    items={[
                      { label: "다운로드", onClick: () => handleDownload(document.id) },
                      { label: "버전 관리", onClick: () => handleVersionManage(document.id) },
                      { label: "보관", onClick: () => handleArchive(document.id) },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
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
  gap: 20px;
  padding: 16px 0;
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
  
  &:nth-child(1) { width: 200px; }
  &:nth-child(2) { width: 200px; justify-content: center; }
  &:nth-child(3) { width: 110px; }
  &:nth-child(4) { width: 110px; }
  &:nth-child(5) { width: 190px; }
  &:nth-child(6) { width: 110px; justify-content: center; }
  &:nth-child(7) { width: 110px; justify-content: center; }
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

const DocumentName = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
`;

const CategoryImage = styled.img`
  width: 97.5px;
  height: 31.5px;
  object-fit: contain;
`;

const VersionText = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
`;

const AuthorText = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
`;

const DateText = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
`;

const StatusIcon = styled.img`
  width: ${props => props.alt === "비활성" ? "69px" : "56px"};
  height: 32px;
  object-fit: contain;
`; 