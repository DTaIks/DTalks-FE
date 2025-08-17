import { useCallback, useMemo } from "react";
import styled from "styled-components";
import CommonTable from "@/components/common/table/CommonTable";
import Pagination from "@/components/common/Pagination";
import type { DocumentInfo } from "@/types/document";

interface DocumentTableProps {
  category: 'policy' | 'glossary' | 'reportform';
  title: string;
  categoryImage: string;
  documents: DocumentInfo[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  selectedStatus: string;
  searchTerm: string; 
  onPageChange: (page: number) => void;
  onStatusChange: (status: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  onArchive?: (id: number, isArchived?: boolean) => void;
  onVersionHistoryClick?: (fileName: string) => void;
  onConfirmModalOpen?: (type: 'archive' | 'download', fileName: string) => void;
  onUpdate?: (documentName: string) => void;
  error?: Error | null;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  category,
  title,
  categoryImage,
  documents,
  isLoading,
  currentPage,
  totalPages,
  selectedStatus,
  searchTerm,
  onPageChange,
  onStatusChange,
  onSearchChange, 
  onArchive,
  onVersionHistoryClick,
  onConfirmModalOpen,
  onUpdate,
  error
}) => {
  // 보관/복원 핸들러
  const handleArchive = useCallback((id: number, isArchived?: boolean) => {
    if (onArchive) {
      onArchive(id, isArchived);
    }
  }, [onArchive]);

  // 변환된 문서 목록
  const transformedDocuments = useMemo(() => 
    documents.map(doc => ({
      documentId: doc.documentId,
      documentName: doc.documentName,
      category: doc.category,
      latestVersion: doc.latestVersion,
      uploaderName: doc.uploaderName,
      lastUpdatedAt: doc.lastUpdatedAt,
      isActive: doc.isActive,
      fileUrl: doc.fileUrl,
    })), [documents]
  );

  // 로딩 상태일 때는 빈 배열 전달 (EmptyState가 표시됨)
  const displayDocuments = isLoading ? [] : transformedDocuments;

  // 모달 객체
  const modals = useMemo(() => ({
    confirmModal: {
      open: onConfirmModalOpen || (() => {})
    },
    handleVersionHistoryClick: onVersionHistoryClick || (() => {})
  }), [onConfirmModalOpen, onVersionHistoryClick]);

  // 에러 처리
  if (error && !isLoading) {
    console.error('Document Table Error:', error);
  }

  return (
    <Container>
      {error && !isLoading && (
        <ErrorMessage>
          문서를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </ErrorMessage>
      )}
      
      <CommonTable
        title={`${title} 목록`}
        items={displayDocuments}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
        onArchive={handleArchive}
        onUpdate={onUpdate}
        categoryImage={categoryImage}
        modals={modals}
        isLoading={isLoading}
      />

      {!isLoading && totalPages > 1 && (
        <PaginationContainer>
          <Pagination
            key={`${category}-${totalPages}`}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </PaginationContainer>
      )}
    </Container>
  );
};

export default DocumentTable;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ErrorMessage = styled.div`
  width: 100%;
  max-width: 1056px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  text-align: center;
  font-size: 14px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 24px;
`;
