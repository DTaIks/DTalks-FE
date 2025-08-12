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
import { useDocumentAllList } from "@/query/useDocumentAllQueries";
import { useDocumentCountByCategory, useRecentUpdateCountByCategory, useActiveDocumentCountByCategory } from "@/query/useDocumentQueries";
import { useDocumentUpdate, useDocumentArchive, useDocumentRestore } from "@/query/useDocumentMutations";


// 전체 문서 관리 페이지
const DocumentAllPage = () => {
  
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
  ];
  
  // 페이지 진입 시 전체 상태로 설정
  useEffect(() => {
    const { setSelectedStatus, setSelectedCategory } = useDocumentStore.getState();
    setSelectedStatus("전체 상태");
    setSelectedCategory("전체 카테고리");
  }, []);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'archive' as 'archive' | 'download', fileName: '' });
  const [versionModal, setVersionModal] = useState({ isOpen: false, fileName: '', fileId: null as number | null });
  const [updateModal, setUpdateModal] = useState({ 
    isOpen: false, 
    documentName: '', 
    initialData: undefined as {
      fileId?: number;
      fileName: string;
      description: string;
      fileVersion: string;
      category: string;
      fileUrl?: string;
    } | undefined
  });
  
  // 전체 문서 쿼리 사용
  const { data: documentData, isLoading, error } = useDocumentAllList(currentPage);
  
  // 문서 수정 뮤테이션
  const documentUpdateMutation = useDocumentUpdate();
  const documentArchiveMutation = useDocumentArchive();
  const documentRestoreMutation = useDocumentRestore();
  
  const documents = useMemo(() => documentData?.documentInfoResponseList || [], [documentData?.documentInfoResponseList]);
  const totalPages = documentData?.pagingInfo?.totalPageCount || 1;
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  const openConfirmModal = (type: 'archive' | 'download', fileName: string) => {
    setConfirmModal({ isOpen: true, type, fileName });
  };
  
  const closeConfirmModal = useCallback(() => {
    setConfirmModal({ isOpen: false, type: 'archive', fileName: '' });
  }, []);
  
  const openVersionModal = (fileName: string) => {
    // 파일명으로 문서 ID를 찾아서 버전 히스토리 모달 열기
    const document = documents.find(doc => doc.documentName === fileName);
    if (document) {
      setVersionModal({ isOpen: true, fileName, fileId: document.documentId });
    }
  };
  
  const closeVersionModal = () => {
    setVersionModal({ isOpen: false, fileName: '', fileId: null });
  };
  
  const openUpdateModal = (documentName: string) => {
    // 문서명으로 해당 문서 정보 찾기
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
  };
  
  const closeUpdateModal = useCallback(() => {
    setUpdateModal({ isOpen: false, documentName: '', initialData: undefined });
  }, []);
  
  useEffect(() => {
    if (currentPage > totalPages) {
      handlePageChange(1);
    }
  }, [totalPages, currentPage, handlePageChange]);

  const handleConfirmAction = useCallback(async () => {
    if (confirmModal.type === 'archive') {
      // 파일명으로 문서 ID를 찾아서 보관/복원 처리
      const documentToArchive = documents.find(
        doc => doc.documentName === confirmModal.fileName
      );
      if (documentToArchive) {
        try {
          if (!documentToArchive.isActive) {
            // isActive가 false면 현재 보관된 상태이므로 복원
            await documentRestoreMutation.mutateAsync(documentToArchive.documentId);
          } else {
            // isActive가 true면 현재 활성 상태이므로 보관
            await documentArchiveMutation.mutateAsync(documentToArchive.documentId);
          }
        } catch (error) {
          console.error('문서 보관/복원 실패:', error);
        }
      }
    } else if (confirmModal.type === 'download') {
      // 다운로드 처리 로직
    }
    closeConfirmModal();
  }, [confirmModal.type, confirmModal.fileName, closeConfirmModal, documents, documentArchiveMutation, documentRestoreMutation]);

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
        isLoading={isLoading}
        error={error}
        onUpdate={openUpdateModal}
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


