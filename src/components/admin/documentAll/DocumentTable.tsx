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
  onArchive?: (id: number) => void;
  onVersionHistoryClick?: (fileName: string) => void;
  onConfirmModalOpen?: (type: 'archive' | 'download', fileName: string) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  category,
  title,
  categoryImage,
  onArchive,
  onVersionHistoryClick,
  onConfirmModalOpen
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
  const { data: documentData, isLoading: isLoadingList } = useDocumentList(
    currentPage, 
    category,
    4
  );

  // 검색 쿼리
  const { data: searchData, isLoading: isLoadingSearch, isDebouncing } = useDocumentSearchByCategory(
    category,
    searchTerm,
    currentPage,
    dataMode === 'search',
    4,
    selectedStatus
  );

  // 상태 필터링 쿼리
  const { data: filterData, isLoading: isLoadingFilter } = useDocumentFilterByCategory(
    category,
    currentPage,
    dataMode === 'filter',
    4,
    selectedStatus
  );

  // 현재 사용할 데이터 결정
  const { currentResponse, currentLoading } = useMemo(() => {
    switch (dataMode) {
      case 'search':
        return {
          currentResponse: searchData,
          currentLoading: isLoadingSearch || isDebouncing
        };
      case 'filter':
        return {
          currentResponse: filterData,
          currentLoading: isLoadingFilter
        };
      default:
        return {
          currentResponse: documentData,
          currentLoading: isLoadingList
        };
    }
  }, [
    dataMode,
    searchData, isLoadingSearch, isDebouncing,
    filterData, isLoadingFilter,
    documentData, isLoadingList
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

  // 페이지 범위 체크
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

  // 보관 처리 핸들러
  const handleArchive = useCallback((id: number) => {
    if (onArchive) {
      onArchive(id);
    }
  }, [onArchive]);

  // 변환된 문서 목록
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

  // 로딩 상태일 때는 빈 배열 전달 (EmptyState가 표시됨)
  const displayDocuments = currentLoading ? [] : transformedDocuments;

  const modals = {
    confirmModal: {
      open: onConfirmModalOpen || (() => {})
    },
    handleVersionHistoryClick: onVersionHistoryClick
  };

  return (
    <Container>
      <CommonTable
        title={`${title} 목록`}
        items={displayDocuments}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        onSearchChange={handleSearch}
        onStatusChange={handleStatusChange}
        onArchive={handleArchive}
        categoryImage={categoryImage}
        modals={modals}
        isLoading={currentLoading}
      />

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <PaginationContainer>
          <Pagination
            key={`${category}-${totalPages}`}
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 24px;
`;