import React, { useCallback } from "react";
import styled from "styled-components";
import { useDocumentStore } from "@/store/documentStore";
import DocumentTableHeader from "./DocumentTableHeader";
import DocumentTableHead from "./DocumentTableHead";
import DocumentTableBody from "./DocumentTableBody";

interface DocumentTableProps {
  currentPage: number;
  itemsPerPage: number;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ currentPage, itemsPerPage }) => {
  const {
    searchTerm,
    selectedCategory,
    setSelectedCategory,
    setSearchTerm,
    archiveDocumentItem,
    getFilteredData
  } = useDocumentStore();

  const { paginatedData } = getFilteredData(currentPage, itemsPerPage);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, [setSelectedCategory]);

  const handleArchive = useCallback((id: number) => {
    archiveDocumentItem(id);
  }, [archiveDocumentItem]);

  return (
    <TableContainer>
      <DocumentTableHeader
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSearchChange={handleSearch}
        onCategoryChange={handleCategoryChange}
      />
      <Table>
        <DocumentTableHead />
        <DocumentTableBody 
          documents={paginatedData}
          onArchive={handleArchive}
        />
      </Table>
    </TableContainer>
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

const Table = styled.div`
  width: 100%;
`; 