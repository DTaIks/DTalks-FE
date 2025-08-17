import { useEffect, useCallback, useState, useMemo } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import DocumentAllStatCard from "@/components/admin/documentAll/DocumentAllStatCard";
import DocumentAllTable from "@/components/admin/documentAll/DocumentAllTable";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { VersionHistoryModal } from "@/components/common/FileVersionManagementModal";
import DocumentUploadModal from "@/components/common/DocumentUploadModal";
import { useDocumentStore } from "@/store/documentStore";
import { useDocumentAllList, useDocumentSearch, useDocumentFilter } from "@/query/useDocumentAllQueries";
import { useDocumentCountByCategory, useRecentUpdateCountByCategory, useActiveDocumentCountByCategory } from "@/query/useDocumentQueries";
import { useDocumentUpdate, useDocumentArchive, useDocumentRestore } from "@/query/useDocumentMutations";

// 타입 정의
interface ConfirmModalState {
  isOpen: boolean;
  type: 'archive' | 'download';
  fileName: string;
}

interface VersionModalState {
  isOpen: boolean;
  fileName: string;
  fileId: number | null;
}

interface UpdateModalState {
  isOpen: boolean;
  documentName: string;
  initialData?: {
    fileId?: number;
    fileName: string;
    description: string;
    fileVersion: string;
    category: string;
    fileUrl?: string;
  };
}


// 전체 문서 관리 페이지
const DocumentAllPage = () => {
  // State 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ 
    isOpen: false, 
    type: 'archive', 
    fileName: '' 
  });
  const [versionModal, setVersionModal] = useState<VersionModalState>({ 
    isOpen: false, 
    fileName: '',
    fileId: null
  });
  const [updateModal, setUpdateModal] = useState<UpdateModalState>({ 
    isOpen: false, 
    documentName: '', 
    initialData: undefined
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
  
  // 통계 관련 쿼리
  const { data: totalCount } = useDocumentCountByCategory('all');
  const { data: recentUpdateCount } = useRecentUpdateCountByCategory('all');
  const { data: activeCount } = useActiveDocumentCountByCategory('all');
  
  // 문서 관련 뮤테이션
  const documentUpdateMutation = useDocumentUpdate();
  const documentArchiveMutation = useDocumentArchive();
  const documentRestoreMutation = useDocumentRestore();
  
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
  
  // 페이지 변경 핸들러
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
  
  // 확인 모달 핸들러
  const openConfirmModal = useCallback((type: 'archive' | 'download', fileName: string) => {
    setConfirmModal({ isOpen: true, type, fileName });
  }, []);
  
  const closeConfirmModal = useCallback(() => {
    setConfirmModal({ isOpen: false, type: 'archive', fileName: '' });
  }, []);
  
  // 버전 모달 핸들러
  const openVersionModal = useCallback((fileName: string) => {
    const document = documents.find(doc => doc.documentName === fileName);
    if (document) {
      setVersionModal({ isOpen: true, fileName, fileId: document.documentId });
    }
  }, [documents]);
  
  const closeVersionModal = useCallback(() => {
    setVersionModal({ isOpen: false, fileName: '', fileId: null });
  }, []);
  
  // 업데이트 모달 핸들러
  const openUpdateModal = useCallback((documentName: string) => {
    const documentToUpdate = documents.find(doc => doc.documentName === documentName);
    if (documentToUpdate) {
      setUpdateModal({
        isOpen: true,
        documentName,
        initialData: {
          fileId: documentToUpdate.documentId,
          fileName: documentToUpdate.documentName,
          description: '',
          fileVersion: documentToUpdate.latestVersion || '1.0.0',
          category: documentToUpdate.category,
          fileUrl: documentToUpdate.fileUrl
        }
      });
    }
  }, [documents]);
  
  const closeUpdateModal = useCallback(() => {
    setUpdateModal({ isOpen: false, documentName: '', initialData: undefined });
  }, []);

  // 확인 액션 핸들러
  const handleConfirmAction = useCallback(async () => {
    if (confirmModal.type === 'archive') {
      const documentToArchive = documents.find(
        doc => doc.documentName === confirmModal.fileName
      );
      if (documentToArchive) {
        try {
          if (!documentToArchive.isActive) {
            await documentRestoreMutation.mutateAsync(documentToArchive.documentId);
          } else {
            await documentArchiveMutation.mutateAsync(documentToArchive.documentId);
          }
        } catch (error) {
          console.error('문서 보관/복원 실패:', error);
        }
      }
    } else if (confirmModal.type === 'download') {
      // 다운로드 처리 로직
      const documentToDownload = documents.find(
        doc => doc.documentName === confirmModal.fileName
      );
      if (documentToDownload?.fileUrl) {
        try {
          const response = await fetch(documentToDownload.fileUrl, { method: 'HEAD' });
          if (response.ok) {
            const link = document.createElement('a');
            link.href = documentToDownload.fileUrl;
            link.download = confirmModal.fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            alert('파일을 찾을 수 없습니다. 관리자에게 문의해주세요.');
          }
        } catch {
          alert('파일 다운로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      } else {
        alert('다운로드할 파일 URL이 없습니다.');
      }
    }
    closeConfirmModal();
  }, [confirmModal.type, confirmModal.fileName, closeConfirmModal, documents, documentArchiveMutation, documentRestoreMutation]);

  // 문서 업데이트 핸들러
  const handleDocumentUpdate = useCallback((data: {
    uploadFile?: File;
    fileName: string;
    description: string;
    fileVersion: string;
    category: string;
  }) => {
    if (updateModal.initialData?.fileId) {
      documentUpdateMutation.mutate({
        fileId: updateModal.initialData.fileId,
        file: data.uploadFile || null,
        fileInfo: {
          fileName: data.fileName,
          description: data.description,
          fileVersion: data.fileVersion,
          category: data.category
        }
      });
      closeUpdateModal();
    }
  }, [updateModal.initialData, documentUpdateMutation, closeUpdateModal]);

  // 모달 객체
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
      
      {/* 에러 상태 표시 */}
      {currentError && !currentLoading && (
        <ErrorMessage>
          문서를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </ErrorMessage>
      )}
      
      <DocumentAllTable 
        documents={documents}
        modals={modals}
        isLoading={currentLoading}
        isSearchMode={dataMode === 'search'}
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