import React from "react";
import styled from "styled-components";
import CustomDropdown from "../../common/CustomDropdown";
import DropDownButton from "../../common/DropDownButton";
import DocumentCategory1 from "../../../assets/document/DocumentCategory1.svg";
import DocumentCategory2 from "../../../assets/document/DocumentCategory2.svg";
import DocumentCategory3 from "../../../assets/document/DocumentCategory3.svg";
import ActiveIcon from "../../../assets/common/Active.svg";

interface DocumentItem {
  id: number;
  name: string;
  category: string;
  categoryImage: string;
  version: string;
  author: string;
  lastModified: string;
  status: string;
  statusIcon: string;
}

interface DocumentTableProps {
  currentPage: number;
  itemsPerPage: number;
}

const DOCUMENT_DATA: DocumentItem[] = [
  {
    id: 1,
    name: "개발팀 업무 매뉴얼",
    category: "매뉴얼",
    categoryImage: DocumentCategory1,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
  {
    id: 2,
    name: "개발팀 업무 매뉴얼",
    category: "사내 규정",
    categoryImage: DocumentCategory2,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
  {
    id: 3,
    name: "개발팀 업무 매뉴얼",
    category: "양식",
    categoryImage: DocumentCategory3,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
  {
    id: 4,
    name: "개발팀 업무 매뉴얼",
    category: "양식",
    categoryImage: DocumentCategory3,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
  {
    id: 5,
    name: "개발팀 업무 매뉴얼",
    category: "양식",
    categoryImage: DocumentCategory3,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
];

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
            {DOCUMENT_DATA
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((document) => (
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
                      { label: "다운로드", onClick: () => console.log('다운로드') },
                      { label: "버전 관리", onClick: () => console.log('버전 관리') },
                      { label: "보관", onClick: () => console.log('보관') },
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
  width: 56px;
  height: 32px;
  object-fit: contain;
`; 