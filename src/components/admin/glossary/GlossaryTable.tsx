import React, { useCallback } from "react";
import { useDocumentStore } from "@/store/documentStore";
import CommonTable from "@/components/common/table/CommonTable";
import DocumentCategory3 from "@/assets/document/DocumentCategory3.svg";

interface GlossaryTableProps {
  currentPage: number;
  itemsPerPage: number;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
    handleVersionHistoryClick?: (fileName: string) => void;
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
    archiveDocumentItem,
    getFilteredData
  } = useDocumentStore();

  const { paginatedData } = getFilteredData(currentPage, itemsPerPage);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value);
  }, [setSelectedStatus]);

  const handleArchive = useCallback((id: number) => {
    archiveDocumentItem(id);
  }, [archiveDocumentItem]);

  return (
    <CommonTable
      title="용어사전 목록"
      items={paginatedData}
      searchTerm={searchTerm}
      selectedStatus={selectedStatus}
      onSearchChange={handleSearch}
      onStatusChange={handleStatusChange}
      onArchive={handleArchive}
      categoryImage={DocumentCategory3}
      modals={modals}
    />
  );
};

export default GlossaryTable;
