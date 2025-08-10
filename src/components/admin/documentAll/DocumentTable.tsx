import React, { useCallback } from "react";
import DocumentCommonTable from "@/components/common/table/DocumentCommonTable";
import type { DocumentInfo } from "@/types/document";

interface DocumentTableProps {
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
}

const DocumentTable: React.FC<DocumentTableProps> = ({ 
  documents,
  modals,
  isLoading = false,
  error = null
}) => {
  // API 데이터를 DocumentItem 형태로 변환
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

  const handleArchive = useCallback((id: number) => {
    // 보관 처리 로직 (API 연동 필요)
  }, []);

  // 로딩 상태일 때는 빈 배열 전달 (EmptyState가 표시됨)
  const displayDocuments = isLoading ? [] : transformedDocuments;

  return (
    <DocumentCommonTable
      title="문서 목록"
      documents={displayDocuments}
      searchTerm=""
      selectedCategory="전체 카테고리"
      selectedStatus="전체 상태"
      onSearchChange={() => {}}
      onCategoryChange={() => {}}
      onStatusChange={() => {}}
      onArchive={handleArchive}
      modals={modals}
      error={error}
    />
  );
};

export default DocumentTable; 
