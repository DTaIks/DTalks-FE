import React from 'react';
import styled from 'styled-components';
import TitleContainer from '@/layout/TitleContainer';

import DepartmentBox from '@/components/admin/media/DepartmentList';
import Header from '@/components/admin/media/MediaHeader';
import MediaFileContent from '@/components/admin/media/MediaFileContentList';
import DropdownFilter from '@/components/common/DropDownFilter';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';

import MediaFileUploadModal from '@/components/admin/media/MediaFileUploadModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { VersionHistoryModal } from '@/components/common/FileVersionManagementModal';
import EmptyState from '@/components/common/EmptyState';

import { useMediaPage } from '@/hooks/media/useMediaPage';
import { useMediaActions } from '@/hooks/media/useMediaActions';
import { useCommonHandlers } from '@/hooks/useCommonHandlers';
import type { MediaFile } from '@/types/media';

const MediaPage: React.FC = () => {
  
  // 부서 목록 정의
  const departments = [
    { id: 'all', name: '전체 파일' },
    { id: 'media', name: '마케팅팀' },
    { id: 'develop', name: '개발팀' },
    { id: 'art', name: '디자인팀' }
  ];
  const {
    selectedDepartment,
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
  

  
  const handlers = useCommonHandlers({ 
    modals: {
      confirmModal: {
        open: openConfirmModal,
      },
      uploadModal: {
        openEdit: openEditModal,
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
      ...mediaActions,
      setSelectedFile
    }
  });

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 확인 모달 액션 핸들러
  const handleConfirmAction = () => {
    mediaActions.handleConfirmAction(confirmModal.type, confirmModal.fileName);
    closeConfirmModal();
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
                onClick={openUploadModal}
                variant="primary"
                width="var(--button-width)"
                height="var(--button-height)"
              />
            </ButtonContainer>
          )}
        </HeaderWrapper>
        
        <ContentContainer>
          <LeftContainer>
            <TitleContainerWrapper>
              <Title>부서별</Title>
            </TitleContainerWrapper>
            <DepartmentListContainer>
              {departments.map(dept => (
                <DepartmentBox 
                  key={dept.id}
                  title={dept.name}
                  icon={<FolderIcon>📁</FolderIcon>}
                  isSelected={selectedDepartment === dept.name && !isArchiveMode}
                  onClick={() => selectDepartment(dept.name)}
                />
              ))}
            </DepartmentListContainer>
            <Footer onClick={() => toggleArchive(true)} isSelected={isArchiveMode}>
              <ArchiveText>보관함</ArchiveText>
            </Footer>
            
            <ArchiveModal className={isArchiveMode ? (isArchiveClosing ? 'close' : 'show') : ''}>
              <ArchiveHeader>
                <ArchiveTitle>보관함</ArchiveTitle>
                <CloseButton onClick={() => toggleArchive(false)}>
                  ✕
                </CloseButton>
              </ArchiveHeader>
              
              <ArchiveContent>
                <ArchiveSubtitle>보관된 항목</ArchiveSubtitle>
                <DepartmentListContainer>
                  {departments.map(dept => (
                    <DepartmentBox 
                      key={`archive-${dept.id}`}
                      title={dept.name}
                      icon={<FolderIcon>📁</FolderIcon>}
                      isSelected={selectedDepartment === dept.name && isArchiveMode}
                      onClick={() => selectArchiveDepartment(dept.name)}
                    />
                  ))}
                </DepartmentListContainer>
              </ArchiveContent>
            </ArchiveModal>
          </LeftContainer>
                    
          <RightContainer>
            <HeaderContainer>
              <Header 
                selectedTeam={selectedDepartment} 
              />
              <DropdownWrapper>
                <DropdownFilter 
                  options={['전체', '문서', '이미지', '음성'] as const}
                  onSelect={selectFileType}
                  placeholder="파일 유형"
                />
              </DropdownWrapper>
            </HeaderContainer>

            <FileContainer>
              <FileContentWrapper>
                {isLoading ? (
                  <LoadingText>파일 목록을 불러오는 중...</LoadingText>
                ) : error ? (
                  <ErrorText>파일 목록을 불러오는데 실패했습니다.</ErrorText>
                ) : files.length === 0 ? (
                  <EmptyState 
                    message="표시할 파일이 없습니다"
                    subMessage="업로드된 파일이 없거나 필터 조건에 맞는 파일이 없습니다."
                  />
                ) : (
                  files.map((file: MediaFile) => (
                    <MediaFileContent 
                      key={file.fileId} 
                      file={file}
                      handlers={handlers}
                      isArchiveMode={isArchiveMode}
                    />
                  ))
                )}
              </FileContentWrapper>
              
              {(files.length > 0 || totalPages > 0) && (
                <PaginationContainer>
                  <Pagination
                    key={totalPages}
                    currentPage={currentPage}
                    totalPages={Math.max(totalPages, 1)}
                    onPageChange={handlePageChange}
                  />
                </PaginationContainer>
              )}
            </FileContainer>
          </RightContainer>
        </ContentContainer>
      </Main>

      <MediaFileUploadModal
        isOpen={uploadModal.isOpen}
        onClose={closeUploadModal}
        onSubmit={handlers.handleUploadSubmit}
        initialData={uploadModal.initialData}
        isEditMode={uploadModal.isEditMode}
        isSubmitting={uploadModal.isEditMode ? isUpdating : isUploading}
      />

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
    </PageContainer>
  );
};

export default MediaPage;

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

const LeftContainer = styled.div`
  width: 240px;
  min-width: 240px; 
  height: 586px;
  border-radius: 25px 0 0 25px;
  background: #F8F9FA;
  border: 1px solid #e9e9ef;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const DepartmentListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
`;

const Footer = styled.div<{ isSelected: boolean }>`
  padding: 16px 16px 16px 34px;
  height: 30px;
  border-top: 1px solid #e0e0e0;
  border-radius: 0 0 0 25px;
  color: ${props => props.isSelected ? 'white' : '#222'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--gap-8);
  transition: all 0.1s ease;
  flex-shrink: 0;
  
  &:hover {
    background: #e9ecef
  }
`;

const ArchiveModal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #F8F9FA;
  border-radius: 25px 0 0 25px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &.show {
    transform: translateY(0);
  }
  
  &.close {
    transform: translateY(100%);
  }
`;

const ArchiveHeader = styled.div`
  display: flex;
  height: 73.5px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
`;

const ArchiveTitle = styled.h2`
  color: var(--color-lightblack);
  font-size: var(--font-size-16);
  padding-top: 4px;
  padding-left: 24px;
  font-weight: var(--font-weight-600);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: var(--font-size-16);
  cursor: pointer;
  color: #6b7280;
  margin-top: 14px;
  padding: var(--padding-12);
  border-radius: 4px;
  transition: color 0.2s ease;
  margin-bottom: 12px;

  &:hover {
    color: #1f2937;
  }
`;

const ArchiveContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ArchiveSubtitle = styled.h3`
  color: #A1A1A1;
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-500);
  margin: 0;
  padding: 16px 24px 12px;
`;

const ArchiveText = styled.span`
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-600);
`;

const RightContainer = styled.div`
  flex: 1;
  min-width: 600px;
  height: 586px;
  border-radius: 0 25px 25px 0;
  background: var(--color-white);
  position: relative;
  flex-shrink: 0;
  border: 1px solid #e9e9ef;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 754px;
  height: 73.5px;
  padding: 0 32px;
  position: absolute;
  top: 0;
  left: 0;
  border-bottom: 1px solid #e0e0e0;
`;

const DropdownWrapper = styled.div`
  position: relative;
  
  & > div {
    position: relative;
    
    & > div:last-child {
      position: absolute;
      top: 100%;
      right: 0;
      left: auto;
      z-index: 1000;
      min-width: 160px;
    }
  }
`;

const FileContainer = styled.div`
  width: 100%;
  height: calc(100% - 74.5px);
  position: absolute;
  top: 74.5px;
  left: 0;
  display: flex;
  flex-direction: column;
`;

const FileContentWrapper = styled.div`
  width: 100%;
  max-width: 1006px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  background: var(--color-white);
  border-radius: 0 25px 25px 0;
`;

const FolderIcon = styled.span`
  font-size: var(--font-size-16);
`;

const TitleContainerWrapper = styled.div`
  height: 73.5px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
`;

const Title = styled.h2`
  color: var(--color-lightblack);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-600);
  line-height: normal;
  padding-left: 32px;

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

const LoadingText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: var(--color-gray);
  font-size: var(--font-size-14);
`;

const ErrorText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #dc3545;
  font-size: var(--font-size-14);
`;