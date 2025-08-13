import { useState, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import Button from "@/components/common/Button";

import ConfirmModal from "@/components/common/ConfirmModal";
import DocumentUploadModal from "@/components/common/DocumentUploadModal";
import { VersionHistoryModal } from "@/components/common/FileVersionManagementModal";
import DocumentTable from "@/components/admin/documentAll/DocumentTable";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useCommonHandlers } from "@/hooks/useCommonHandlers";
import { useDocumentUpload, useDocumentUpdate, useDocumentArchive, useDocumentRestore } from "@/query/useDocumentMutations";
import DocumentCategory1 from "@/assets/document/DocumentCategory1.svg";
import DocumentCategory2 from "@/assets/document/DocumentCategory2.svg";
import DocumentCategory3 from "@/assets/document/DocumentCategory3.svg";

// 통합 문서 관리 페이지
const DocumentPage = () => {
  const { category } = useParams<{ category: string }>();
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
  const [documents, setDocuments] = useState<Array<{
    documentId: number;
    documentName: string;
    latestVersion: string;
    category: string;
    fileUrl: string;
    isActive: boolean;
  }>>([]);
  
  // 문서 업로드 뮤테이션
  const documentUploadMutation = useDocumentUpload();
  const documentUpdateMutation = useDocumentUpdate();
  const documentArchiveMutation = useDocumentArchive();
  const documentRestoreMutation = useDocumentRestore();

  // 카테고리별 설정
  const categoryConfig = {
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

  // 문서 업로드 핸들러
  const handleDocumentUpload = useCallback(async (data: {
    uploadFile?: File;
    fileName: string;
    description: string;
    fileVersion: string;
    category: string;
  }) => {
    if (!data.uploadFile) {
      console.error('업로드할 파일이 없습니다.');
      return;
    }

    const fileInfo = {
      fileName: data.fileName,
      description: data.description,
      fileVersion: data.fileVersion,
      category: data.category // 모달에서 선택된 카테고리 값을 그대로 사용
    };

    

    try {
      await documentUploadMutation.mutateAsync({ file: data.uploadFile, fileInfo });
    } catch (error) {
      console.error('문서 업로드 실패:', error);
    }
  }, [documentUploadMutation]);

  // 문서 수정 핸들러
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
  }, [documents]);

  // 공통 핸들러 사용
  const { handleArchiveByFileName } = useCommonHandlers({
    modals: {
      confirmModal: {
        open: () => {} // 실제로는 사용하지 않음
      },
             versionModal: {
         open: (fileName: string) => setVersionModal({ isOpen: true, fileName, fileId: null }),
         close: () => setVersionModal({ isOpen: false, fileName: '', fileId: null }),
         isOpen: versionModal.isOpen
       }
    }
  });

  // 파일 업로드 hook 사용
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
      // 파일 수정 처리
    },
    onArchive: handleArchiveByFileName,
    onDownload: (fileName: string, fileUrl?: string) => {
      // 다운로드 처리 - useCommonHandlers의 handleDownloadClick과 동일한 로직
      if (fileUrl) {
        // fileUrl이 있으면 유효성 검사 후 다운로드
        fetch(fileUrl, { method: 'HEAD' })
          .then(response => {
            if (response.ok) {
              // 파일이 존재하면 다운로드
              const link = document.createElement('a');
              link.href = fileUrl;
              link.download = fileName;
              link.style.display = 'none';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              // 파일이 존재하지 않으면 에러 메시지 표시
              alert('파일을 찾을 수 없습니다. 관리자에게 문의해주세요.');
            }
          })
          .catch(() => {
            alert('파일 다운로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          });
             } else {
         // fileUrl이 없으면 확인 모달 표시
       }
    }
  });

  const handleArchive = useCallback(async (id: number, isArchived?: boolean) => {
    try {
      if (isArchived) {
        // isArchived가 true면 현재 보관된 상태이므로 복원
        await documentRestoreMutation.mutateAsync(id);
      } else {
        // isArchived가 false면 현재 활성 상태이므로 보관
        await documentArchiveMutation.mutateAsync(id);
      }
    } catch (error) {
      console.error('문서 보관/복원 실패:', error);
    }
  }, [documentArchiveMutation, documentRestoreMutation]);

  const handleVersionHistoryClick = useCallback((fileName: string) => {
    // 파일명으로 문서 ID를 찾아서 버전 히스토리 모달 열기
    const document = documents.find(doc => doc.documentName === fileName);
    if (document) {
      setVersionModal({ isOpen: true, fileName, fileId: document.documentId });
    }
  }, [documents]);

  const handleConfirmModalOpen = useCallback(() => {
    // confirmModal 열기 로직
  }, []);

  // 유효하지 않은 카테고리인 경우 리다이렉트
  if (!category || !categoryConfig[category as keyof typeof categoryConfig]) {
    return <Navigate to="/admin/documents" replace />;
  }

  const config = categoryConfig[category as keyof typeof categoryConfig];

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
      
      <DocumentTable
        category={category as 'policy' | 'glossary' | 'reportform'}
        title={config.title}
        categoryImage={config.image}
        onArchive={handleArchive}
        onVersionHistoryClick={handleVersionHistoryClick}
        onConfirmModalOpen={handleConfirmModalOpen}
        onUpdate={openUpdateModal}
        onDocumentsLoaded={setDocuments}
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
    font-family: var(--font-pretendard);
    font-size: var(--font-size-18);
    font-style: normal;
    font-weight: var(--table-header-font-weight);
    line-height: normal;
  }
`;
