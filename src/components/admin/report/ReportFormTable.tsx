import React, { useCallback } from "react";
import { useDocumentStore } from "@/store/documentStore";
import CommonTable from "@/components/common/table/CommonTable";
import DocumentCategory1 from "@/assets/document/DocumentCategory1.svg";

interface ReportFormTableProps {
  currentPage: number;
  itemsPerPage: number;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
  };
}

const ReportFormTable: React.FC<ReportFormTableProps> = ({ 
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
      title="보고서 양식 목록"
      items={paginatedData}
      searchTerm={searchTerm}
      selectedStatus={selectedStatus}
      onSearchChange={handleSearch}
      onStatusChange={handleStatusChange}
      onArchive={handleArchive}
      categoryImage={DocumentCategory1}
      modals={modals}
    />
  );
};

export default ReportFormTable;
