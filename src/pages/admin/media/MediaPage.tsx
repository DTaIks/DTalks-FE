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

import { useDepartmentStats } from '@/hooks/media/useMediaFile';
import { useMediaPageState } from '@/hooks/media/useMediaPageState';
import { useMediaActions } from '@/hooks/media/useMediaActions';
import { useCommonHandlers } from '@/hooks/useCommonHandlers';

const MediaPage: React.FC = () => {
  // 데이터 및 상태 관리
  const departments = useDepartmentStats();
  const { filters, archive, modals, actions } = useMediaPageState();
  const mediaActions = useMediaActions();
  
  const handlers = useCommonHandlers({ 
    modals: {
      confirmModal: modals.confirmModal,
      uploadModal: modals.uploadModal,
      versionModal: modals.versionModal
    }, 
    mediaActions 
  });

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5; // 페이지당 표시할 파일 수

  // 현재 페이지의 파일들 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFiles = filters.filteredFiles.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filters.filteredFiles.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 필터나 부서 변경 시 페이지를 1로 리셋
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters.selectedDepartment, filters.selectedFileType, archive.isMode]);

  // 확인 모달 액션 핸들러
  const handleConfirmAction = () => {
    mediaActions.handleConfirmAction(modals.confirmModal.type, modals.confirmModal.fileName);
    modals.confirmModal.close();
  };

  return (
    <PageContainer>
      <Main>
        <PageHeaderContainer>
          <TitleContainer 
            title="미디어 파일 관리" 
            subtitle="파일을 체계적으로 관리하고 버전을 추적하세요"
          />
        </PageHeaderContainer>
        
        {!archive.isMode && (
          <ButtonContainer>
            <StyledUploadButton 
              text="파일 업로드"
              onClick={modals.uploadModal.open}
              variant="primary"
              width="var(--button-width)"
              height="var(--button-height)"
            />
          </ButtonContainer>
        )}
        
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
                  isSelected={filters.selectedDepartment === dept.name && !archive.isMode}
                  onClick={() => dept.name === '전체 파일' ? actions.handleAllSelect() : actions.handleDepartmentSelect(dept.name)}
                />
              ))}
            </DepartmentListContainer>
            <Footer onClick={archive.select} isSelected={archive.isMode}>
              <ArchiveText>보관함</ArchiveText>
            </Footer>
            
            <ArchiveModal className={archive.isMode ? (archive.isClosing ? 'close' : 'show') : ''}>
              <ArchiveHeader>
                <ArchiveTitle>보관함</ArchiveTitle>
                <CloseButton onClick={archive.close}>
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
                      isSelected={filters.selectedDepartment === dept.name && archive.isMode}
                      onClick={() => archive.selectDepartment(dept.name)}
                    />
                  ))}
                </DepartmentListContainer>
              </ArchiveContent>
            </ArchiveModal>
          </LeftContainer>
                    
          <RightContainer>
            <HeaderContainer>
              <Header 
                selectedTeam={filters.selectedDepartment} 
              />
              <DropdownWrapper>
                <DropdownFilter 
                  options={['전체', '문서', '이미지', '음성'] as const}
                  onSelect={actions.handleFileTypeSelect}
                  placeholder="파일 유형"
                />
              </DropdownWrapper>
            </HeaderContainer>

            <FileContainer>
              <FileContentWrapper>
                {currentFiles.map(file => (
                  <MediaFileContent 
                    key={file.fileId} 
                    file={file}
                    handlers={handlers}
                    isArchiveMode={archive.isMode}
                  />
                ))}
              </FileContentWrapper>
              
              {filters.filteredFiles.length > 0 && (
                <PaginationContainer>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </PaginationContainer>
              )}
            </FileContainer>
          </RightContainer>
        </ContentContainer>
      </Main>

      <MediaFileUploadModal
        isOpen={modals.uploadModal.isOpen}
        onClose={modals.uploadModal.close}
        onSubmit={handlers.handleUploadSubmit}
        initialData={modals.uploadModal.initialData}
        isEditMode={modals.uploadModal.isEditMode}
      />

      <ConfirmModal
        isOpen={modals.confirmModal.isOpen}
        onClose={modals.confirmModal.close}
        onConfirm={handleConfirmAction}
        fileName={modals.confirmModal.fileName}
        type={modals.confirmModal.type}
      />

      <VersionHistoryModal
        isOpen={modals.versionModal.isOpen}
        onClose={modals.versionModal.close}
        fileName={modals.versionModal.fileName}
      />
    </PageContainer>
  );
};

export default MediaPage;

const PageContainer = styled.div`
  width: 1062px;
  height: 586px;
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

const PageHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  box-sizing: border-box;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  height: 760px;
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
  height: 40.5px;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
`;

const ArchiveTitle = styled.h2`
  color: var(--color-lightblack);
  font-size: var(--font-size-18);
  padding-top: 4px;
  padding-left: 12px;
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
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-500);
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
  position: absolute;
  top: var(--gap-60);
  margin-left: 888px;
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
