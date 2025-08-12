import React, { useCallback } from "react";
import DocumentCommonTable from "@/components/common/table/DocumentCommonTable";
import type { DocumentInfo } from "@/types/document";
import type { DocumentAllTableProps } from "@/types/table";

const DocumentAllTable: React.FC<DocumentAllTableProps> = ({ 
  documents,
  modals,
  isLoading = false,
  error = null,
  onUpdate
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
    // 파일명으로 문서를 찾아서 confirmModal 열기
    const document = documents.find(doc => doc.documentId === id);
    if (document) {
      modals.confirmModal.open('archive', document.documentName);
    }
  }, [documents, modals.confirmModal]);

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
      onUpdate={onUpdate}
      modals={modals}
      error={error}
    />
  );
};

export default DocumentAllTable;
