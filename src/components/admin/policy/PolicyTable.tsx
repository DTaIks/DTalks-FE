import React, { useCallback } from "react";
import { useDocumentStore } from "@/store/documentStore";
import CommonTable from "@/components/common/table/CommonTable";
import DocumentCategory2 from "@/assets/document/DocumentCategory2.svg";

interface PolicyTableProps {
  currentPage: number;
  itemsPerPage: number;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
    handleVersionHistoryClick?: (fileName: string) => void;
  };
}

const PolicyTable: React.FC<PolicyTableProps> = ({ 
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
      title="사내 정책 목록"
      items={paginatedData}
      searchTerm={searchTerm}
      selectedStatus={selectedStatus}
      onSearchChange={handleSearch}
      onStatusChange={handleStatusChange}
      onArchive={handleArchive}
      categoryImage={DocumentCategory2}
      modals={modals}
    />
  );
};

export default PolicyTable;
