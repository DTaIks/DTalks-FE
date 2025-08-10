import { useState, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import DocumentUploadModal from "@/components/common/DocumentUploadModal";
import { VersionHistoryModal } from "@/components/common/FileVersionManagementModal";
import DocumentTable from "@/components/admin/documentAll/DocumentTable";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useCommonHandlers } from "@/hooks/useCommonHandlers";
import DocumentCategory1 from "@/assets/document/DocumentCategory1.svg";
import DocumentCategory2 from "@/assets/document/DocumentCategory2.svg";
import DocumentCategory3 from "@/assets/document/DocumentCategory3.svg";

// 통합 문서 관리 페이지
const DocumentPage = () => {
  const { category } = useParams<{ category: string }>();
  const [versionModal, setVersionModal] = useState({ isOpen: false, fileName: '' });

  // 카테고리별 설정
  const categoryConfig = {
    'policy': {
      title: "사내 정책",
      subtitle: "모든 사내 정책 문서를 한 번에 확인하고 정리하세요",
      image: DocumentCategory1
    },
    'glossary': {
      title: "용어사전",
      subtitle: "모든 용어 사전 문서를 한 번에 확인하고 정리하세요",
      image: DocumentCategory3
    },
    'reportform': {
      title: "보고서 양식",
      subtitle: "모든 보고서 양식 문서를 한 번에 확인하고 정리하세요",
      image: DocumentCategory2
    }
  };

  // 유효하지 않은 카테고리인 경우 리다이렉트
  if (!category || !categoryConfig[category as keyof typeof categoryConfig]) {
    return <Navigate to="/admin/documents" replace />;
  }

  const config = categoryConfig[category as keyof typeof categoryConfig];

  // 공통 핸들러 사용
  const { handleArchiveByFileName } = useCommonHandlers({
    modals: {
      confirmModal: {
        open: () => {} // 실제로는 사용하지 않음
      },
      versionModal: {
        open: (fileName: string) => setVersionModal({ isOpen: true, fileName }),
        close: () => setVersionModal({ isOpen: false, fileName: '' }),
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
    pageType: category as 'policy' | 'glossary' | 'report',
    onUpload: () => {
      // 파일 업로드 처리
    },
    onEdit: () => {
      // 파일 수정 처리
    },
    onArchive: handleArchiveByFileName,
    onDownload: () => {
      // 다운로드 처리
    }
  });

  const handleArchive = useCallback((id: number) => {
    // 보관 처리 로직
    console.log('보관 처리:', id);
  }, []);

  const handleVersionHistoryClick = useCallback((fileName: string) => {
    setVersionModal({ isOpen: true, fileName });
  }, []);

  const handleConfirmModalOpen = useCallback((type: 'archive' | 'download', fileName: string) => {
    // confirmModal 열기 로직
    console.log(`${type} 모달 열기:`, fileName);
  }, []);

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
      />

      <DocumentUploadModal
        isOpen={uploadModal.isOpen}
        onClose={handleCloseUploadModal}
        onSubmit={handleSubmit}
        pageType={category as 'policy' | 'glossary' | 'report'}
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
        onClose={() => setVersionModal({ isOpen: false, fileName: '' })}
        fileName={versionModal.fileName}
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
