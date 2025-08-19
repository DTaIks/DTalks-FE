import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import TitleContainer from '@/layout/TitleContainer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import Button from '@/components/common/Button';
import MediaFileUploadModal from '@/components/admin/media/MediaFileUploadModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import ErrorModal from '@/components/common/ErrorModal';
import { VersionHistoryModal } from '@/components/common/FileVersionManagementModal';
import { authAPI } from '@/api/authAPI';
import MediaSidebar from '@/components/admin/media/MediaSidebar';
import MediaContent from '@/components/admin/media/MediaContent';
import { useMediaPage } from '@/hooks/media/useMediaPage';
import { useMediaActions } from '@/hooks/media/useMediaActions';
import { useCommonHandlers } from '@/hooks/useCommonHandlers';
import type { MediaFile } from '@/types/media';
import type { MediaUploadData } from '@/types/modal';
import type { AxiosError } from 'axios';

const MediaPage: React.FC = () => {
  useScrollToTop();
  
  // 권한 관련 상태
  const [userRole, setUserRole] = useState<string>('사용자');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 프로필 정보 조회
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await authAPI.getProfile();
        setUserRole(profileData.role);
      } catch (error) {
        console.error('프로필 조회 실패:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // 권한 확인 함수
  const checkUserPermission = useCallback((): boolean => {
    if (!userRole || userRole === '사용자') {
      setErrorMessage('접근 권한이 없습니다.');
      setIsErrorModalOpen(true);
      return false;
    }
    return true;
  }, [userRole]);
  
  // 부서 목록 정의
  const departments = [
    { id: 'all', name: '전체 파일' },
    { id: 'media', name: '마케팅팀' },
    { id: 'develop', name: '개발팀' },
    { id: 'art', name: '디자인팀' }
  ];
  const {
    selectedDepartment,
    selectedFileType,
    isArchiveMode,
    isArchiveClosing,
    currentPage,
    uploadModal,
    confirmModal,
    versionModal,
    files,
    totalPages,
    isLoading,
    error,
    isUploading,
    isUpdating,
    setCurrentPage,
    openUploadModal,
    closeUploadModal,
    openEditModal,
    openConfirmModal,
    closeConfirmModal,
    openVersionModal,
    closeVersionModal,
    selectDepartment,
    selectFileType,
    toggleArchive,
    selectArchiveDepartment,
    setSelectedFile,
  } = useMediaPage();

  const mediaActions = useMediaActions();
  
  const baseHandlers = useCommonHandlers({ 
    modals: {
      confirmModal: {
        open: (type: 'archive' | 'download' | 'restore', fileName: string) =>
          openConfirmModal(type === 'restore' ? 'archive' : type, fileName),
      },
      uploadModal: {
        openEdit: (data: { fileName: string; description: string; fileVersion: string; isPublic: boolean }) =>
          openEditModal({
            fileName: data.fileName,
            description: data.description,
            fileVersion: data.fileVersion,
            isPublic: data.isPublic,
          } as MediaUploadData),
        close: closeUploadModal,
        isEditMode: uploadModal.isEditMode,
      },
      versionModal: {
        open: openVersionModal,
        close: closeVersionModal,
        isOpen: versionModal.isOpen,
      }
    }, 
    mediaActions: {
      handleUpload: (
        data: { fileName: string; description: string; fileVersion: string; isPublic: boolean },
        onSuccess?: () => void,
        onError?: (message: string) => void
      ) =>
        mediaActions.handleUpload({ ...data } as MediaUploadData, onSuccess, onError),
      handleEdit: (
        data: { fileName: string; description: string; fileVersion: string; isPublic: boolean },
        onSuccess?: () => void,
        onError?: (message: string) => void
      ) =>
        mediaActions.handleEdit({ ...data } as MediaUploadData, onSuccess, onError),
      setSelectedFile
    }
  });

  const handlers = {
    ...baseHandlers,
    handleDownloadClick: baseHandlers.handleDownloadClick,
    handleVersionManagementClick: baseHandlers.handleVersionManagementClick,
    handleDocumentArchive: baseHandlers.handleDocumentArchive,
    handleConfirmAction: () => {
      if (confirmModal.type === 'archive') {
        const fileToArchive = files.find(file => file.fileName === confirmModal.fileName);
        if (fileToArchive) {
          mediaActions.handleArchive(fileToArchive.fileId);
        }
      } else if (confirmModal.type === 'download') {
        // 확인 모달에서 다운로드 처리
        const fileToDownload = files.find(file => file.fileName === confirmModal.fileName);
        if (fileToDownload && fileToDownload.fileUrl) {
          // 파일 유효성 검사 후 다운로드
          fetch(fileToDownload.fileUrl, { method: 'HEAD' })
            .then(response => {
              if (response.ok) {
                const link = document.createElement('a');
                link.href = fileToDownload.fileUrl!;
                link.download = fileToDownload.fileName;
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
        }
      }
      closeConfirmModal();
    },
    handleEditClick: (file: MediaFile) => {
      if (checkUserPermission()) {
        baseHandlers.handleEditClick(file);
      }
    },
    handleArchiveClick: (fileName: string) => {
      if (checkUserPermission()) {
        baseHandlers.handleArchiveClick(fileName);
      }
    },
    handleUploadSubmit: (data: { uploadFile?: File | null; fileName: string; description: string; fileVersion: string; isPublic: boolean }) => {
      if (checkUserPermission()) {
        baseHandlers.handleUploadSubmit(data);
      }
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <PageContainer>
      <Main>
        <HeaderWrapper>
          <TitleContainer 
            title="미디어 파일 관리" 
            subtitle="파일을 체계적으로 관리하고 버전을 추적하세요"
          />
          {!isArchiveMode && (
            <ButtonContainer>
              <StyledUploadButton 
                text="파일 업로드"
                onClick={() => {
                  if (checkUserPermission()) {
                    openUploadModal();
                  }
                }}
                variant="primary"
                width="var(--button-width)"
                height="var(--button-height)"
              />
            </ButtonContainer>
          )}
        </HeaderWrapper>
        
        <ContentContainer>
          <MediaSidebar
            departments={departments}
            selectedDepartment={selectedDepartment}
            isArchiveMode={isArchiveMode}
            isArchiveClosing={isArchiveClosing}
            onSelectDepartment={selectDepartment}
            onToggleArchive={() => {
              if (checkUserPermission()) {
                toggleArchive(!isArchiveMode);
              }
            }}
            onSelectArchiveDepartment={selectArchiveDepartment}
          />
          
          <MediaContent
            selectedDepartment={selectedDepartment}
            selectedFileType={selectedFileType}
            isArchiveMode={isArchiveMode}
            files={files}
            totalPages={totalPages}
            currentPage={currentPage}
            isLoading={isLoading}
            error={(error as AxiosError)?.response?.status === 403 ? '403' : (error?.message || (error ? String(error) : null))}
            handlers={handlers}
            onSelectFileType={selectFileType}
            onPageChange={handlePageChange}
          />
        </ContentContainer>
      </Main>

      <MediaFileUploadModal
        isOpen={uploadModal.isOpen}
        onClose={closeUploadModal}
        onSubmit={handlers.handleUploadSubmit}
        initialData={uploadModal.initialData ?? undefined}
        isEditMode={uploadModal.isEditMode}
        isSubmitting={uploadModal.initialData ? isUpdating : isUploading}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handlers.handleConfirmAction}
        fileName={confirmModal.fileName}
        type={confirmModal.type}
      />

      <VersionHistoryModal
        isOpen={versionModal.isOpen}
        onClose={closeVersionModal}
        fileName={versionModal.fileName}
        fileId={versionModal.fileId}
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        errorMessage={errorMessage}
      />
    </PageContainer>
  );
};

export default MediaPage;

// Styled Components
const PageContainer = styled.div`
  width: 1062px;
  min-height: 586px;
  background: var(--color-ghostwhite);
  display: flex;
  flex-direction: column;
  overflow-x: hidden; 
`;

const Main = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden; 
`;

const HeaderWrapper = styled.div`
  position: relative;
  width: 1056px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 40px auto 32px auto;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  height: 586px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  height: 64px;
`;

const StyledUploadButton = styled(Button)`
  && {
    color: var(--color-white);
    font-family: var(--font-pretendard);
    font-size: var(--font-size-18);
    font-style: normal;
    font-weight: var(--table-header-font-weight);
    line-height: normal;
  }
`;