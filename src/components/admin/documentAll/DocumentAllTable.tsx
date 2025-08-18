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
  onUpdate?: (documentName: string) => void;
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
  onStatusChange,
  onUpdate
}) => {
  // 문서 데이터 변환
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

  // 보관 핸들러
  const handleArchive = useCallback((id: number) => {
    // 문서 ID로 문서를 찾아서 confirmModal 열기
    const document = documents.find(doc => doc.documentId === id);
    if (document) {
      modals.confirmModal.open('archive', document.documentName);
    }
  }, [documents, modals.confirmModal]);

  // 검색 핸들러
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e);
  }, [onSearch]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = useCallback((category: string) => {
    onCategoryChange?.(category);
  }, [onCategoryChange]);

  // 상태 변경 핸들러
  const handleStatusChange = useCallback((status: string) => {
    onStatusChange?.(status);
  }, [onStatusChange]);

  // 업데이트 핸들러
  const handleUpdate = useCallback((documentName: string) => {
    onUpdate?.(documentName);
  }, [onUpdate]);

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
      onUpdate={handleUpdate}
      modals={modals}
      error={error}
    />
  );
};

export default DocumentAllTable;
