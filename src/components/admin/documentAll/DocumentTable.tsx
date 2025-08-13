import { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import CommonTable from "@/components/common/table/CommonTable";
import Pagination from "@/components/common/Pagination";
import { 
  useDocumentList, 
  useDocumentSearchByCategory, 
  useDocumentFilterByCategory
} from "@/query/useDocumentQueries";
import type { DocumentInfo } from "@/types/document";

interface DocumentTableProps {
  category: 'policy' | 'glossary' | 'reportform';
  title: string;
  categoryImage: string;
  onArchive?: (id: number, isArchived?: boolean) => void;
  onVersionHistoryClick?: (fileName: string) => void;
  onConfirmModalOpen?: (type: 'archive' | 'download', fileName: string) => void;
  onUpdate?: (documentName: string) => void;
  onDocumentsLoaded?: (documents: DocumentInfo[]) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  category,
  title,
  categoryImage,
  onArchive,
  onVersionHistoryClick,
  onConfirmModalOpen,
  onUpdate,
  onDocumentsLoaded
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("전체 상태");

  // 데이터 모드 결정 로직
  const dataMode = useMemo(() => {
    const hasSearchTerm = searchTerm.trim().length > 0;
    const hasSpecificStatus = selectedStatus !== '전체 상태';
    
    if (hasSearchTerm) return 'search';
    if (hasSpecificStatus) return 'filter';
    return 'list';
  }, [searchTerm, selectedStatus]);

  // 기본 문서 목록 쿼리
  const { data: documentData, isLoading: isLoadingList, error: listError } = useDocumentList(
    currentPage, 
    category,
    4
  );

  // 검색 쿼리
  const { data: searchData, isLoading: isLoadingSearch, isDebouncing, error: searchError } = useDocumentSearchByCategory(
    category,
    searchTerm,
    currentPage,
    dataMode === 'search',
    4,
    selectedStatus
  );

  // 상태 필터링 쿼리
  const { data: filterData, isLoading: isLoadingFilter, error: filterError } = useDocumentFilterByCategory(
    category,
    currentPage,
    dataMode === 'filter',
    4,
    selectedStatus
  );

  // 현재 사용할 데이터 결정
  const { currentResponse, currentLoading, currentError } = useMemo(() => {
    switch (dataMode) {
      case 'search':
        return {
          currentResponse: searchData,
          currentLoading: isLoadingSearch || isDebouncing,
          currentError: searchError
        };
      case 'filter':
        return {
          currentResponse: filterData,
          currentLoading: isLoadingFilter,
          currentError: filterError
        };
      default:
        return {
          currentResponse: documentData,
          currentLoading: isLoadingList,
          currentError: listError
        };
    }
  }, [
    dataMode,
    searchData, isLoadingSearch, isDebouncing, searchError,
    filterData, isLoadingFilter, filterError,
    documentData, isLoadingList, listError
  ]);

  // 문서 목록과 총 페이지 수 추출
  const { documents, totalPages } = useMemo(() => {
    let items: DocumentInfo[] = [];
    let pages = 1;

    if (dataMode === 'search' || dataMode === 'filter') {
      items = currentResponse?.content || [];
      pages = currentResponse?.totalPages || 1;
    } else {
      items = currentResponse?.documentInfoResponseList || [];
      pages = currentResponse?.pagingInfo?.totalPageCount || 1;
    }

    return { documents: items, totalPages: pages };
  }, [currentResponse, dataMode]);

  // 문서 목록이 로드되면 부모 컴포넌트에 전달
  useEffect(() => {
    if (onDocumentsLoaded && documents.length > 0) {
      onDocumentsLoaded(documents);
    }
  }, [documents, onDocumentsLoaded]);
  
  // 페이지 범위 체크 및 조정
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // 검색어, 상태가 변경되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // 검색 핸들러
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // 상태 변경 핸들러
  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
  }, []);

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
  const displayDocuments = currentLoading ? [] : transformedDocuments;

  // 모달 객체
  const modals = useMemo(() => ({
    confirmModal: {
      open: onConfirmModalOpen || (() => {})
    },
    handleVersionHistoryClick: onVersionHistoryClick || (() => {})
  }), [onConfirmModalOpen, onVersionHistoryClick]);

  // 에러 처리
  if (currentError && !currentLoading) {
    console.error('Document Table Error:', currentError);
  }

  return (
    <Container>
      {/* 에러 상태 표시 */}
      {currentError && !currentLoading && (
        <ErrorMessage>
          문서를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </ErrorMessage>
      )}
      
      <CommonTable
        title={`${title} 목록`}
        items={displayDocuments}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        onSearchChange={handleSearch}
        onStatusChange={handleStatusChange}
        onArchive={handleArchive}
        onUpdate={onUpdate}
        categoryImage={categoryImage}
        modals={modals}
        isLoading={currentLoading}
      />

      {/* 페이지네이션 - 로딩 중이 아니고 페이지가 1개 이상일 때만 표시 */}
      {!currentLoading && totalPages > 1 && (
        <PaginationContainer>
          <Pagination
            key={`${category}-${totalPages}-${dataMode}`}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
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
