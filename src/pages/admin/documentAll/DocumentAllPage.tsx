import { useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import DocumentAllStatCard from "@/components/admin/documentAll/DocumentAllStatCard";
import DocumentAllTable from "@/components/admin/documentAll/DocumentAllTable";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { VersionHistoryModal } from "@/components/common/FileVersionManagementModal";
import DocumentUploadModal from "@/components/common/DocumentUploadModal";
import { useDocumentStore } from "@/store/documentStore";
import { useDocumentCountByCategory, useRecentUpdateCountByCategory, useActiveDocumentCountByCategory } from "@/query/useDocumentQueries";

// 분리된 훅들 import
import { useDocumentAllData } from "@/hooks/document/useDocumentAllData";
import { useDocumentAllModals } from "@/hooks/document/useDocumentAllModals";
import { useDocumentAllActions } from "@/hooks/document/usdDocumentAllActions";

// 전체 문서 관리 페이지
const DocumentAllPage = () => {
  // 전역 상태 직접 사용
  const {
    searchTerm,
    selectedCategory,
    selectedStatus,
    setSearchTerm,
    setSelectedCategory,
    setSelectedStatus,
  } = useDocumentStore();

  // 1. 데이터 관리
  const {
    currentPage,
    setCurrentPage,
    setRefreshKey,
    documents,
    totalPages,
    currentLoading,
    currentError,
    isSearchMode,
  } = useDocumentAllData();

  // 2. 모달 관리
  const {
    confirmModal,
    versionModal,
    updateModal,
    openConfirmModal,
    closeConfirmModal,
    openVersionModal,
    closeVersionModal,
    openUpdateModal,
    closeUpdateModal,
  } = useDocumentAllModals(documents);

  // 3. 액션 핸들러
  const {
    handleSearch,
    handleCategoryChange,
    handleStatusChange,
    handleConfirmAction,
    handleDocumentUpdate,
    documentUpdateMutation,
  } = useDocumentAllActions({
    documents,
    setSelectedCategory,
    setSelectedStatus,
    setSearchTerm,
    setRefreshKey,
    isSearchMode,
    closeConfirmModal,
    closeUpdateModal,
    confirmModal,
    updateModal,
  });

  // 4. 통계 데이터
  const { data: totalCount } = useDocumentCountByCategory('all');
  const { data: recentUpdateCount } = useRecentUpdateCountByCategory('all');
  const { data: activeCount } = useActiveDocumentCountByCategory('all');
  
  const stats = useMemo(() => [
    {
      title: "전체 문서",
      value: `${totalCount?.documentCount || 0}개`,
      additionalInfo: "총 문서수"
    },
    {
      title: "최근 업데이트 문서 수",
      value: `${recentUpdateCount?.documentCount || 0}개`,
      additionalInfo: "이번 주"
    },
    {
      title: "활성 버전",
      value: `${activeCount?.documentCount || 0}개`,
      additionalInfo: "활성 문서 수"
    }
  ], [totalCount, recentUpdateCount, activeCount]);

  // 5. 초기 설정
  useEffect(() => {
    const { setSelectedStatus, setSelectedCategory } = useDocumentStore.getState();
    setSelectedStatus("전체 상태");
    setSelectedCategory("전체 카테고리");
  }, []);

  // 6. 페이지 변경 핸들러
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  // 7. 모달 객체
  const modals = useMemo(() => ({
    confirmModal: {
      open: openConfirmModal,
      close: closeConfirmModal
    },
    versionModal: {
      open: openVersionModal,
      close: closeVersionModal,
      isOpen: versionModal.isOpen
    }
  }), [openConfirmModal, closeConfirmModal, openVersionModal, closeVersionModal, versionModal.isOpen]);

  return (
    <Container>
      <HeaderWrapper>
        <TitleContainer title="전체 문서" subtitle="모든 사내 문서를 한 번에 확인하고 정리하세요" />
      </HeaderWrapper>
      
      <DocumentAllStatCard stats={stats} />
      
      {currentError && !currentLoading && (
        <ErrorMessage>
          문서를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </ErrorMessage>
      )}
      
      <DocumentAllTable 
        documents={documents}
        modals={modals}
        isLoading={currentLoading}
        isSearchMode={isSearchMode}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus} 
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onUpdate={openUpdateModal}
      />
      
      {!currentLoading && totalPages > 1 && (
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
        fileId={versionModal.fileId || undefined}
        pageType="document"
      />

      <DocumentUploadModal
        isOpen={updateModal.isOpen}
        onClose={closeUpdateModal}
        onSubmit={handleDocumentUpdate}
        isSubmitting={documentUpdateMutation.isPending}
        mode="update"
        initialData={updateModal.initialData}
      />
    </Container>
  );
};

export default DocumentAllPage;

// 스타일드 컴포넌트들
const Container = styled.div`
  width: 100%;
  height: 100%;
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