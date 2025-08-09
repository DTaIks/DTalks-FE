import React, { useCallback } from "react";
import { useDocumentStore } from "@/store/documentStore";
import DocumentCommonTable from "@/components/common/table/DocumentCommonTable";

interface DocumentTableProps {
  currentPage: number;
  itemsPerPage: number;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
  };
}

const DocumentTable: React.FC<DocumentTableProps> = ({ 
  currentPage, 
  itemsPerPage,
  modals
}) => {
  const {
    searchTerm,
    selectedCategory,
    selectedStatus,
    setSelectedCategory,
    setSelectedStatus,
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

  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value);
  }, [setSelectedStatus]);

  const handleArchive = useCallback((id: number) => {
    archiveDocumentItem(id);
  }, [archiveDocumentItem]);

      return (
      <DocumentCommonTable
      title="문서 목록"
      documents={paginatedData}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      selectedStatus={selectedStatus}
      onSearchChange={handleSearch}
      onCategoryChange={handleCategoryChange}
      onStatusChange={handleStatusChange}
      onArchive={handleArchive}
      modals={modals}
    />
  );
};

export default DocumentTable; 
