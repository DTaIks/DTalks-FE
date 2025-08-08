import React, { useCallback } from "react";
import styled from "styled-components";
import { useGlossaryStore } from "@/store/glossaryStore";
import GlossaryTableHeader from "./GlossaryTableHeader";
import GlossaryTableHead from "./GlossaryTableHead";
import GlossaryTableBody from "./GlossaryTableBody";

interface GlossaryTableProps {
  currentPage: number;
  itemsPerPage: number;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
  };
}

const GlossaryTable: React.FC<GlossaryTableProps> = ({ 
  currentPage, 
  itemsPerPage,
  modals
}) => {
  const {
    searchTerm,
    selectedStatus,
    setSelectedStatus,
    setSearchTerm,
    archiveGlossaryItem,
    getFilteredData
  } = useGlossaryStore();

  const { paginatedData } = getFilteredData(currentPage, itemsPerPage);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value);
  }, [setSelectedStatus]);

  const handleArchive = useCallback((id: number) => {
    archiveGlossaryItem(id);
  }, [archiveGlossaryItem]);

  return (
    <TableContainer>
      <GlossaryTableHeader
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        onSearchChange={handleSearch}
        onStatusChange={handleStatusChange}
      />
      <Table>
        <GlossaryTableHead />
        <GlossaryTableBody 
          glossaryItems={paginatedData}
          onArchive={handleArchive}
          modals={modals}
        />
      </Table>
    </TableContainer>
  );
};

export default GlossaryTable;

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
