import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Button from "@/components/common/Button";
import CompareCard from "@/components/common/document/DocumentCompareCard";
import ConfirmModal from "@/components/common/ConfirmModal";
import DocumentUploadModal from "@/components/common/DocumentUploadModal";
import { VersionHistoryModal } from "@/components/common/FileVersionManagementModal";
import DocumentTable from "@/components/admin/documentAll/DocumentTable";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useCommonHandlers } from "@/hooks/useCommonHandlers";
import { useDocumentUpload, useDocumentUpdate, useDocumentArchive, useDocumentRestore } from "@/query/useDocumentMutations";
import { useDocumentList, useDocumentSearchByCategory } from "@/query/useDocumentQueries";
import { useDocumentStore } from "@/store/documentStore";
import DocumentCategory1 from "@/assets/document/DocumentCategory1.svg";
import DocumentCategory2 from "@/assets/document/DocumentCategory2.svg";
import DocumentCategory3 from "@/assets/document/DocumentCategory3.svg";

// 타입 정의들
interface CategoryConfig {
  title: string;
  subtitle: string;
  image: string;
}

type CategoryKey = 'policy' | 'glossary' | 'reportform';

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

// 통합 문서 관리 페이지
const DocumentPage = () => {
  useScrollToTop();
  
  const { category } = useParams<{ category: string }>();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const prevStatusRef = useRef<string>('');
  
  // 기존 State 관리
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
  
  // 검색 및 필터 상태 (전역 상태 사용)
  const { 
    selectedStatus,
    setSelectedStatus 
  } = useDocumentStore();
  
  // 문서 관련 뮤테이션
  const documentUploadMutation = useDocumentUpload();
  const documentUpdateMutation = useDocumentUpdate();
  const documentArchiveMutation = useDocumentArchive();
  const documentRestoreMutation = useDocumentRestore();

  // 검색 모드 여부 결정
  const isSearchMode = searchTerm.trim().length > 0;

  // 일반 문서 목록 조회
  const { 
    data: documentListData, 
    isLoading: isListLoading, 
    error: listError 
  } = useDocumentList(
    currentPage,
    category as CategoryKey,
    4,
    selectedStatus
  );

  // 검색 결과 조회
  const { 
    data: searchData, 
    isLoading: isSearchLoading, 
    error: searchError,
    isDebouncing,
    refetch: refetchSearch
  } = useDocumentSearchByCategory(
    category as CategoryKey,
    searchTerm,
    currentPage,
    isSearchMode,
    4,
    selectedStatus,
    refreshKey 
  );

  // 상태 변경을 감지하여 검색 
  useEffect(() => {
    // 상태가 실제로 변경되었을 때만 처리
    if (prevStatusRef.current !== selectedStatus && prevStatusRef.current !== '') {
      console.log('상태 변경 감지:', { prev: prevStatusRef.current, current: selectedStatus });
      
      if (isSearchMode) {
        const timeoutId = setTimeout(() => {
          refetchSearch();
        }, 200);
        
        return () => clearTimeout(timeoutId);
      }
    }
    
    // 현재 상태를 이전 상태로 업데이트
    prevStatusRef.current = selectedStatus;
  }, [selectedStatus, isSearchMode, refetchSearch]);

  // 현재 사용할 데이터와 로딩 상태 결정
  const currentData = isSearchMode ? searchData : documentListData;
  const isLoading = isSearchMode ? (isSearchLoading || isDebouncing) : isListLoading;
  const error = isSearchMode ? searchError : listError;

  // 문서 목록과 총 페이지 수 추출
  const { documents, totalPages } = useMemo(() => {
    const items = currentData?.content || [];
    const pages = currentData?.totalPages || 1;
    console.log('현재 표시할 문서:', { 
      mode: isSearchMode ? 'search' : 'list', 
      count: items.length, 
      status: selectedStatus,
      searchTerm: searchTerm.trim()
    });
    return { documents: items, totalPages: pages };
  }, [currentData, isSearchMode, selectedStatus, searchTerm]);

  // 카테고리별 설정
  const categoryConfig: Record<CategoryKey, CategoryConfig> = {
    'policy': {
      title: "사내 정책",
      subtitle: "모든 사내 정책 문서를 한 번에 확인하고 정리하세요",
      image: DocumentCategory2
    },
    'glossary': {
      title: "용어사전",
      subtitle: "모든 용어 사전 문서를 한 번에 확인하고 정리하세요",
      image: DocumentCategory3
    },
    'reportform': {
      title: "보고서 양식",
      subtitle: "모든 보고서 양식 문서를 한 번에 확인하고 정리하세요",
      image: DocumentCategory1
    }
  };

  // 검색어 변경 핸들러
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  // 상태 필터 변경 핸들러
  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    
    // 강제 리페치를 위해 키 변경
    setRefreshKey(prev => prev + 1);
    
    if (!isSearchMode) {
      queryClient.invalidateQueries({ 
        queryKey: ['documentList', category]
      });
    }
    
    // 검색 관련 쿼리는 항상 무효화
    queryClient.removeQueries({ 
      queryKey: ['documentSearchByCategory', category],
      exact: false
    });
  }, [selectedStatus, setSelectedStatus, queryClient, category, isSearchMode]);

  // CompareCard에서 버전 비교를 처리하는 핸들러
  const handleVersionCompare = useCallback((documentName: string, version1: string, version2: string) => {
    console.log(`버전 비교 완료: ${documentName} - v${version1} vs v${version2}`);
  }, []);

  // 문서 업로드 핸들러
  const handleDocumentUpload = useCallback(async (data: {
    uploadFile?: File;
    fileName: string;
    description: string;
    fileVersion: string;
    category: string;
  }) => {
    if (!data.uploadFile) {
      return;
    }

    const fileInfo = {
      fileName: data.fileName,
      description: data.description,
      fileVersion: data.fileVersion,
      category: data.category
    };

    try {
      await documentUploadMutation.mutateAsync({ file: data.uploadFile, fileInfo });
      setSearchTerm("");
      setCurrentPage(1);
    } catch (error) {
      console.error('문서 업로드 실패:', error);
    }
  }, [documentUploadMutation]);

  // 문서 수정 관련 핸들러
  const closeUpdateModal = useCallback(() => {
    setUpdateModal({ isOpen: false, documentName: '', initialData: undefined });
  }, []);

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

  // 다운로드 핸들러
  const handleDownload = useCallback((fileName: string, fileUrl?: string) => {
    if (fileUrl) {
      fetch(fileUrl, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            alert('파일을 찾을 수 없습니다. 관리자에게 문의해주세요.');
          }
        })
        .catch(() => {
          alert('파일 다운로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        });
    } else {
      alert('다운로드할 파일 URL이 없습니다.');
    }
  }, []);

  // 공통 핸들러 사용
  const { handleArchiveByFileName } = useCommonHandlers({
    modals: {
      confirmModal: {
        open: () => {} 
      },
      versionModal: {
        open: (fileName: string) => {
          const document = documents.find(doc => doc.documentName === fileName);
          setVersionModal({ 
            isOpen: true, 
            fileName, 
            fileId: document?.documentId || null 
          });
        },
        close: () => setVersionModal({ isOpen: false, fileName: '', fileId: null }),
        isOpen: versionModal.isOpen
      }
    }
  });

  // 파일 업로드 훅
  const {
    uploadModal,
    confirmModal,
    handleFileUploadClick,
    handleCloseUploadModal,
    handleSubmit,
    handleConfirmAction,
    closeConfirmModal,
    getButtonText
  } = useFileUpload({
    pageType: category as 'policy' | 'glossary' | 'reportform',
    onUpload: handleDocumentUpload,
    onEdit: () => {
    },
    onArchive: handleArchiveByFileName,
    onDownload: handleDownload
  });

  // 보관/복원 핸들러
  const handleArchive = useCallback(async (id: number, isArchived?: boolean) => {
    try {
      if (isArchived) {
        await documentRestoreMutation.mutateAsync(id);
      } else {
        await documentArchiveMutation.mutateAsync(id);
      }
    } catch (error) {
      console.error('문서 보관/복원 실패:', error);
    }
  }, [documentArchiveMutation, documentRestoreMutation]);

  // 버전 히스토리 클릭 핸들러
  const handleVersionHistoryClick = useCallback((fileName: string) => {
    const document = documents.find(doc => doc.documentName === fileName);
    if (document) {
      setVersionModal({ isOpen: true, fileName, fileId: document.documentId });
    }
  }, [documents]);

  // 확인 모달 열기 핸들러
  const handleConfirmModalOpen = useCallback((type: 'archive' | 'download', fileName: string) => {
    console.log(`${type} 모달 열기:`, fileName);
  }, []);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const isValidCategory = (cat: string | undefined): cat is CategoryKey => {
    return cat !== undefined && Object.keys(categoryConfig).includes(cat);
  };

  if (!category || !isValidCategory(category)) {
    return <Navigate to="/admin/documents" replace />;
  }

  const config = categoryConfig[category];

  return (
    <Container>
      <HeaderWrapper>
        <TitleContainer title={config.title} subtitle={config.subtitle} />
        <ButtonContainer>
          <StyledButton 
            text={getButtonText()} 
            width="var(--button-width)" 
            height="var(--button-height)"
            onClick={handleFileUploadClick}
          />
        </ButtonContainer>
      </HeaderWrapper>
      
      <CompareCardWrapper>
        <CompareCard
          category={category}
          onVersionCompare={handleVersionCompare}
        />
      </CompareCardWrapper>
      
      <DocumentTable
        category={category}
        title={config.title}
        categoryImage={config.image}
        documents={documents}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        selectedStatus={selectedStatus}
        searchTerm={searchTerm}
        onPageChange={handlePageChange}
        onStatusChange={handleStatusChange}
        onSearchChange={handleSearchChange}
        onArchive={handleArchive}
        onVersionHistoryClick={handleVersionHistoryClick}
        onConfirmModalOpen={handleConfirmModalOpen}
        onUpdate={openUpdateModal}
        error={error}
      />

      <DocumentUploadModal
        isOpen={uploadModal.isOpen}
        onClose={handleCloseUploadModal}
        onSubmit={handleSubmit}
        pageType={category as 'policy' | 'glossary' | 'reportform'}
        isSubmitting={documentUploadMutation.isPending}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        fileName={confirmModal.selectedFileName}
        type={confirmModal.modalType}
      />

      <VersionHistoryModal
        isOpen={versionModal.isOpen}
        onClose={() => setVersionModal({ isOpen: false, fileName: '', fileId: null })}
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

export default DocumentPage;

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

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  height: 64px;
`;

const StyledButton = styled(Button)`
  && {
    color: var(--color-white);
    font-size: var(--font-size-18);
    font-weight: var(--table-header-font-weight);
  }
`;

const CompareCardWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;