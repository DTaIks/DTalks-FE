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
  userRole?: string;
  onPageChange: (page: number) => void;
  onStatusChange: (status: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 

  onVersionHistoryClick?: (fileName: string) => void;
  onConfirmModalOpen?: (type: 'archive' | 'download' | 'restore', fileName: string) => void;
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
  userRole,
  onPageChange,
  onStatusChange,
  onSearchChange, 

  onVersionHistoryClick,
  onConfirmModalOpen,
  onUpdate,
  error
}) => {
  // 보관/복원 핸들러
  const handleArchive = useCallback((id: number) => {
    // 문서 ID로 문서를 찾아서 confirmModal 열기
    const document = documents.find(doc => doc.documentId === id);
    if (document && onConfirmModalOpen) {
      const modalType = document.isActive ? 'archive' : 'restore';
      onConfirmModalOpen(modalType, document.documentName);
    }
  }, [documents, onConfirmModalOpen]);

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

  // 에러 메시지 결정
  const getErrorMessage = () => {
    if (!error) return '';
    
    // 403 권한 오류인지 확인
    const isPermissionError = error.message?.includes('403') || 
                             error.message?.includes('권한') ||
                             error.message?.includes('접근') ||
                             (error as { response?: { status?: number } })?.response?.status === 403;
    
    if (isPermissionError) {
      return '접근 권한이 없습니다.';
    }
    
    return '문서를 불러오는데 실패했습니다.';
  };

  // 에러 서브메시지 결정
  const getErrorSubMessage = () => {
    if (!error) return '';
    
    const isPermissionError = error.message?.includes('403') || 
                             error.message?.includes('권한') ||
                             error.message?.includes('접근') ||
                             (error as { response?: { status?: number } })?.response?.status === 403;
    
    if (isPermissionError) {
      return '관리자에게 문의해주세요.';
    }
    
    return '잠시 후 다시 시도해주세요.';
  };

  return (
    <Container>
      <CommonTable
        title={`${title} 목록`}
        items={displayDocuments}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        userRole={userRole}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
        onArchive={handleArchive}
        onUpdate={onUpdate}
        categoryImage={categoryImage}
        modals={modals}
        isLoading={isLoading}
        error={error && !isLoading ? {
          message: getErrorMessage(),
          subMessage: getErrorSubMessage()
        } : null}
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 24px;
`;
