import { useEffect, useCallback, useState, useMemo } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import DocumentAllStatCard from "@/components/admin/documentAll/DocumentAllStatCard";
import DocumentAllTable from "@/components/admin/documentAll/DocumentAllTable";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { VersionHistoryModal } from "@/components/common/FileVersionManagementModal";
import { useDocumentStore } from "@/store/documentStore";
import { useDocumentAllList, useDocumentSearch, useDocumentFilter } from "@/query/useDocumentAllQueries";
import { useDocumentCountByCategory, useRecentUpdateCountByCategory, useActiveDocumentCountByCategory } from "@/query/useDocumentQueries";

// 전체 문서 관리 페이지
const DocumentAllPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    type: 'archive' as 'archive' | 'download', 
    fileName: '' 
  });
  const [versionModal, setVersionModal] = useState({ 
    isOpen: false, 
    fileName: '' 
  });
  
  // 검색 및 필터 상태
  const { 
    searchTerm, 
    selectedCategory, 
    selectedStatus,
    setSearchTerm, 
    setSelectedCategory,
    setSelectedStatus 
  } = useDocumentStore();
  
  // 전체 문서 수 조회
  const { data: totalCount } = useDocumentCountByCategory('all');
  
  // 최근 업데이트 문서 수 조회
  const { data: recentUpdateCount } = useRecentUpdateCountByCategory('all');
  
  // 활성 문서 수 조회
  const { data: activeCount } = useActiveDocumentCountByCategory('all');
  
  // API 데이터로 통계 생성
  const stats = [
    {
      title: "전체 문서",
      value: totalCount?.documentCount?.toString() || "0",
      additionalInfo: "총 문서수"
    },
    {
      title: "최근 업데이트 문서 수",
      value: `${recentUpdateCount?.documentCount || 0}개`,
      additionalInfo: "+1개 이번 주"
    },
    {
      title: "활성 문서 수",
      value: `${activeCount?.documentCount || 0}개`,
      additionalInfo: "+1개 이번 달"
    }
  ];
  
  // 데이터 모드 결정
  const dataMode = useMemo(() => {
    const hasSearchTerm = searchTerm.trim().length > 0;
    const hasSpecificCategory = selectedCategory !== '전체 카테고리';
    const hasSpecificStatus = selectedStatus !== '전체 상태';
    
    if (hasSearchTerm) return 'search';
    if (hasSpecificCategory && hasSpecificStatus) return 'categoryAndStatus';
    if (hasSpecificCategory) return 'category';
    if (hasSpecificStatus) return 'status';
    return 'list';
  }, [searchTerm, selectedCategory, selectedStatus]);

  // 전체 문서 목록 쿼리
  const { data: documentListData, isLoading: isListLoading, error: listError } = useDocumentAllList(
    currentPage, 
    4, 
    selectedStatus
  );
  
  // 문서 검색 쿼리
  const { data: documentSearchData, isLoading: isSearchLoading, error: searchError, isDebouncing } = useDocumentSearch(
    selectedCategory === '전체 카테고리' ? 'all' : selectedCategory,
    searchTerm,
    currentPage,
    dataMode === 'search',
    4,
    selectedStatus
  );

  // 문서 카테고리별 필터링 쿼리 
  const { data: documentCategoryFilterData, isLoading: isCategoryFilterLoading, error: categoryFilterError } = useDocumentFilter(
    selectedCategory,
    currentPage,
    dataMode === 'category',
    4,
    selectedStatus
  );

  // 카테고리, 상태 조합 필터링 쿼리
  const { data: documentCombinedFilterData, isLoading: isCombinedFilterLoading, error: combinedFilterError } = useDocumentFilter(
    selectedCategory,
    currentPage,
    dataMode === 'categoryAndStatus',
    4,
    selectedStatus
  );

  // 상태만 필터링 쿼리
  const { data: documentStatusFilterData, isLoading: isStatusFilterLoading, error: statusFilterError } = useDocumentAllList(
    currentPage,
    4,
    selectedStatus
  );

  // 현재 사용할 데이터 결정
  const { currentResponse, currentLoading, currentError } = useMemo(() => {
    switch (dataMode) {
      case 'search':
        return {
          currentResponse: documentSearchData,
          currentLoading: isSearchLoading || isDebouncing,
          currentError: searchError
        };
      case 'category':
        return {
          currentResponse: documentCategoryFilterData,
          currentLoading: isCategoryFilterLoading,
          currentError: categoryFilterError
        };
      case 'status':
        return {
          currentResponse: documentStatusFilterData,
          currentLoading: isStatusFilterLoading,
          currentError: statusFilterError
        };
      case 'categoryAndStatus':
        return {
          currentResponse: documentCombinedFilterData,
          currentLoading: isCombinedFilterLoading,
          currentError: combinedFilterError
        };
      default:
        return {
          currentResponse: documentListData,
          currentLoading: isListLoading,
          currentError: listError
        };
    }
  }, [
    dataMode, 
    documentSearchData, isSearchLoading, isDebouncing, searchError,
    documentCategoryFilterData, isCategoryFilterLoading, categoryFilterError,
    documentStatusFilterData, isStatusFilterLoading, statusFilterError,
    documentCombinedFilterData, isCombinedFilterLoading, combinedFilterError,
    documentListData, isListLoading, listError
  ]);

  // 문서 목록과 총 페이지 수 추출
  const { documents, totalPages } = useMemo(() => {
    const items = currentResponse?.content || [];
    const pages = currentResponse?.totalPages || 1;
    return { documents: items, totalPages: pages };
  }, [currentResponse]);
  
  // 페이지 진입 시 전체 상태로 설정
  useEffect(() => {
    const { setSelectedStatus, setSelectedCategory } = useDocumentStore.getState();
    setSelectedStatus("전체 상태");
    setSelectedCategory("전체 카테고리");
  }, []);

  // 총 페이지가 변경되었을 때 현재 페이지가 범위를 벗어나면 첫 페이지로 이동
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // 검색어, 카테고리, 상태가 변경되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // 검색 핸들러
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, [setSelectedCategory]);

  // 상태 변경 핸들러
  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
  }, [setSelectedStatus]);
  
  const openConfirmModal = (type: 'archive' | 'download', fileName: string) => {
    setConfirmModal({ isOpen: true, type, fileName });
  };
  
  const closeConfirmModal = useCallback(() => {
    setConfirmModal({ isOpen: false, type: 'archive', fileName: '' });
  }, []);
  
  const openVersionModal = (fileName: string) => {
    setVersionModal({ isOpen: true, fileName });
  };
  
  const closeVersionModal = () => {
    setVersionModal({ isOpen: false, fileName: '' });
  };

  const handleConfirmAction = useCallback(() => {
    if (confirmModal.type === 'archive') {
      const { archiveDocumentItem } = useDocumentStore.getState();
      const documentToArchive = documents.find(
        doc => doc.documentName === confirmModal.fileName
      );
      if (documentToArchive) {
        archiveDocumentItem(documentToArchive.documentId);
      }
    } else if (confirmModal.type === 'download') {
      console.log(`${confirmModal.fileName} 다운로드 처리`);
    }
    closeConfirmModal();
  }, [confirmModal.type, confirmModal.fileName, closeConfirmModal, documents]);

  const modals = {
    confirmModal: {
      open: openConfirmModal,
      close: closeConfirmModal
    },
    versionModal: {
      open: openVersionModal,
      close: closeVersionModal,
      isOpen: versionModal.isOpen
    }
  };

  return (
    <Container>
      <HeaderWrapper>
        <TitleContainer title="전체 문서" subtitle="모든 사내 문서를 한 번에 확인하고 정리하세요" />
      </HeaderWrapper>
      <DocumentAllStatCard stats={stats} />
      <DocumentAllTable 
        documents={documents}
        modals={modals}
        isLoading={currentLoading}
        error={currentError}
        isSearchMode={dataMode === 'search'}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus} 
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange} 
      />
      {totalPages >= 1 && (
        <PaginationContainer>
          <Pagination
            key={totalPages}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </PaginationContainer>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        fileName={confirmModal.fileName}
        type={confirmModal.type}
      />

      <VersionHistoryModal
        isOpen={versionModal.isOpen}
        onClose={closeVersionModal}
        fileName={versionModal.fileName}
      />
    </Container>
  );
};

export default DocumentAllPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  position: relative;
  width: 1056px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 32px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 24px;
`;
