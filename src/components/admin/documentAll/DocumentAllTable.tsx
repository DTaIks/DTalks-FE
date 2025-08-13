import React, { useCallback } from "react";
import DocumentCommonTable from "@/components/common/table/DocumentCommonTable";
import type { DocumentInfo } from "@/types/document";

interface DocumentAllTableProps {
  documents: DocumentInfo[];
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
      close: () => void;
    };
    versionModal: {
      open: (fileName: string) => void;
      close: () => void;
      isOpen: boolean;
    };
  };
  isLoading?: boolean;
  error?: Error | null;
  isSearchMode?: boolean;
  searchTerm?: string;
  selectedCategory?: string;
  selectedStatus?: string; 
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange?: (category: string) => void;
  onStatusChange?: (status: string) => void; 
}

const DocumentAllTable: React.FC<DocumentAllTableProps> = ({
  documents,
  modals,
  isLoading = false,
  error = null,
  searchTerm = "",
  selectedCategory = "",
  selectedStatus = "", 
  onSearch,
  onCategoryChange,
  onStatusChange 
}) => {
  const transformedDocuments = documents.map(doc => ({
    documentId: doc.documentId,
    documentName: doc.documentName,
    category: doc.category,
    latestVersion: doc.latestVersion,
    uploaderName: doc.uploaderName,
    lastUpdatedAt: doc.lastUpdatedAt,
    isActive: doc.isActive,
    fileUrl: doc.fileUrl,
  }));

  const handleArchive = useCallback(() => {
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e);
  }, [onSearch]);

  const handleCategoryChange = useCallback((category: string) => {
    onCategoryChange?.(category);
  }, [onCategoryChange]);

  // 상태 변경 핸들러 추가
  const handleStatusChange = useCallback((status: string) => {
    onStatusChange?.(status);
  }, [onStatusChange]);

  // 로딩 상태일 때는 빈 배열 전달 (EmptyState가 표시됨)
  const displayDocuments = isLoading ? [] : transformedDocuments;

  return (
    <DocumentCommonTable
      title="문서 목록"
      documents={displayDocuments}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      selectedStatus={selectedStatus} 
      onSearchChange={handleSearchChange}
      onCategoryChange={handleCategoryChange}
      onStatusChange={handleStatusChange}
      onArchive={handleArchive}
      modals={modals}
      error={error}
    />
  );
};

export default DocumentAllTable;
