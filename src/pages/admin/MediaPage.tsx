import React, { useState, useMemo, useCallback } from 'react';
import Sidebar from '../../layout/Sidebar';
import styled from 'styled-components';

import DepartmentBox from '../../components/admin/media/DepartmentList';
import Header from '../../components/admin/media/MediaHeader';
import MediaFileContent from '../../components/admin/media/MediaFileContentList';
import DropdownFilter from '../../components/common/DropDownFilter';
import Button from '../../components/common/Button';

import MediaFileUploadModal, { type MediaUploadData } from '../../components/admin/mediaModal/MediaFileUploadModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { 
  useDepartmentStats, 
  useFiles,
  type MediaFile
} from '../../hooks/useMediaFile';

import { useArchivedFilesStore } from '../../store/archivedFileStore';

const MediaPage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('전체 파일');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedFileType, setSelectedFileType] = useState<'document' | 'image' | 'audio' | 'all'>('all');
  const [isArchiveMode, setIsArchiveMode] = useState<boolean>(false);
  const [isArchiveClose, setIsArchiveClose] = useState<boolean>(false);
  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'archive' | 'download'>('download');

  const departments = useDepartmentStats();
  const files = useFiles();
  
  const { 
    archivedFiles, 
    archiveFile,
  } = useArchivedFilesStore();
  
  const getFilteredFiles = useMemo((): MediaFile[] => {
    let filteredFiles = files;
    
    // 보관 모드에 따라 필터링
    if (isArchiveMode) {
      filteredFiles = filteredFiles.filter(file => archivedFiles.includes(file.fileId));
    } else {
      filteredFiles = filteredFiles.filter(file => !archivedFiles.includes(file.fileId));
    }
    
    // 부서별 필터링
    if (selectedDepartment !== '전체 파일') {
      filteredFiles = filteredFiles.filter(file => file.departmentName === selectedDepartment);
    }
    
    // 파일 타입별 필터링
    if (selectedFileType !== 'all') {
      filteredFiles = filteredFiles.filter(file => file.fileType === selectedFileType);
    }
    
    return filteredFiles;
  }, [files, archivedFiles, isArchiveMode, selectedDepartment, selectedFileType]);

  const filesData = getFilteredFiles;

  // 부서 선택 핸들러
  const handleDepartmentSelect = useCallback((departmentName: string): void => {
    setSelectedDepartment(departmentName);
    setSelectedFileType('all');
    if (!isArchiveMode) {
      setIsArchiveMode(false);
    }
  }, [isArchiveMode]);

  // 보관함에서 부서 선택 핸들러
  const handleArchiveDepartmentSelect = useCallback((departmentName: string): void => {
    setSelectedDepartment(departmentName);
    setSelectedFileType('all');
  }, []);

  // 파일 타입 선택 핸들러
  const handleFileTypeSelect = useCallback((fileType: '전체' | '문서' | '이미지' | '음성'): void => {
    const fileTypeMap: Record<string, 'document' | 'image' | 'audio' | 'all'> = {
      '전체': 'all',
      '문서': 'document', 
      '이미지': 'image',
      '음성': 'audio'
    };
    setSelectedFileType(fileTypeMap[fileType]);
  }, []);

  // 전체 선택 핸들러
  const handleAllSelect = useCallback((): void => {
    setSelectedDepartment('전체 파일');
    setSelectedFileType('all');
    setIsArchiveMode(false);
  }, []);

  // 보관함 선택 핸들러
  const handleArchiveSelect = useCallback((): void => {
    setIsArchiveMode(true);
    setSelectedDepartment('전체 파일');
    setSelectedFileType('all');
  }, []);

  // 보관함 닫기 핸들러
  const handleArchiveClose = useCallback((): void => {
    setIsArchiveClose(true);
    setTimeout(() => {
      setIsArchiveMode(false);
      setIsArchiveClose(false);
    }, 400);
  }, []);

  // 업로드 클릭 핸들러
  const handleUploadClick = useCallback((): void => {
    setIsMediaUploadModalOpen(true);
  }, []);

  // 모달 닫기 핸들러
  const handleCloseModal = useCallback((): void => {
    setIsMediaUploadModalOpen(false);
  }, []);

  // 파일 업로드 핸들러들
  const handleMediaUploadSubmit = useCallback((data: MediaUploadData): void => {
    console.log('미디어 파일 업로드 데이터:', data);
    alert(`미디어 파일 "${data.fileName}"이 업로드되었습니다!`);
    setIsMediaUploadModalOpen(false);
  }, []);

  // 다운로드 핸들러
  const handleDownload = useCallback((fileName: string): void => {
    setSelectedFileName(fileName);
    setModalType('download');
    setIsConfirmModalOpen(true);
  }, []);

  // 보관 핸들러
  const handleArchive = useCallback((fileName: string): void => {
    setSelectedFileName(fileName);
    setModalType('archive');
    setIsConfirmModalOpen(true);
  }, []);

  // 확인 모달 닫기 핸들러
  const handleConfirmModalClose = useCallback((): void => {
    setIsConfirmModalOpen(false);
    setSelectedFileName('');
  }, []);

  // 확인 액션 핸들러
  const handleConfirmAction = useCallback((): void => {
    const selectedFile = files.find(file => file.fileName === selectedFileName);
    
    if (!selectedFile) return;

    if (modalType === 'download') {
      alert(`${selectedFileName} 다운로드를 시작합니다.`);
    } 
    else if (modalType === 'archive') {
      archiveFile(selectedFile.fileId);
      alert(`${selectedFileName}을 보관합니다.`);
    }
    
    setIsConfirmModalOpen(false);
    setSelectedFileName('');
  }, [files, selectedFileName, modalType, archiveFile]);

  return (
    <PageContainer>
      <Sidebar />
      <Main>
        <PageHeaderContainer>
          <PageTitleContainer>
            <PageTitle>미디어 파일 관리</PageTitle>
            <PageDescription>파일을 체계적으로 관리하고 버전을 추적하세요</PageDescription>
          </PageTitleContainer>
          
          {!isArchiveMode && (
            <Button
              text="파일 업로드"
              onClick={handleUploadClick}
              variant="primary"
              width="172px"
              height="44px"
              fontSize="18px"
            />
          )}
        </PageHeaderContainer>
        
        <ContentContainer>
          <LeftContainer>
            <Title>부서별</Title>
            <DepartmentListContainer>
              {departments.map(dept => (
                <DepartmentBox 
                  key={dept.id}
                  title={dept.name}
                  icon={<FolderIcon>📁</FolderIcon>}
                  isSelected={selectedDepartment === dept.name && !isArchiveMode}
                  onClick={() => dept.name === '전체 파일' ? handleAllSelect() : handleDepartmentSelect(dept.name)}
                />
              ))}
            </DepartmentListContainer>
            <Footer onClick={handleArchiveSelect} isSelected={isArchiveMode}>
              <ArchiveText>보관함</ArchiveText>
            </Footer>
            
            <ArchiveModal className={isArchiveMode ? (isArchiveClose ? 'close' : 'show') : ''}>
              <ArchiveHeader>
                <ArchiveTitle>보관함</ArchiveTitle>
                <CloseButton onClick={handleArchiveClose}>
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
                      onClick={() => handleArchiveDepartmentSelect(dept.name)}
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
                selectedFileType={selectedFileType}
              />
              <DropdownWrapper>
                <DropdownFilter 
                  options={['전체', '문서', '이미지', '음성'] as const}
                  onSelect={handleFileTypeSelect}
                  placeholder="파일 유형"
                />
              </DropdownWrapper>
            </HeaderContainer>
            <Divider />

            <FileContainer>
              <FileContentWrapper>
                {filesData.map(file => (
                  <MediaFileContent 
                    key={file.fileId} 
                    file={file}
                    onDownloadClick={() => handleDownload(file.fileName)}
                    onArchiveClick={() => handleArchive(file.fileName)}
                    isArchiveMode={isArchiveMode}
                  />
                ))}
              </FileContentWrapper>
            </FileContainer>
          </RightContainer>
        </ContentContainer>
      </Main>

      <MediaFileUploadModal
        isOpen={isMediaUploadModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleMediaUploadSubmit}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleConfirmModalClose}
        onConfirm={handleConfirmAction}
        fileName={selectedFileName}
        type={modalType}
      />
    </PageContainer>
  );
};

export default MediaPage;

const PageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: var(--color-ghostwhite);
  display: flex;
  overflow-x: hidden;
`;

const Main = styled.div`
  width: calc(100vw - 320px);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const PageHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  padding: 0 40px;
  margin-top: 160px;
  box-sizing: border-box;
`;

const PageTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 280px);
  padding: 20px 40px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
`;

const LeftContainer = styled.div`
  width: 240px;
  height: calc(100% - 32px);
  border-radius: 25px 0 0 25px;
  background: #F8F9FA;
  border: 1px solid #e9e9ef;
  margin-top: 32px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const DepartmentListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
`;

const Footer = styled.div<{ isSelected: boolean }>`
  padding: 16px 16px 16px 34px;
  border-top: 1px solid #e0e0e0;
  border-radius: 0 0 0 25px;
  color: ${props => props.isSelected ? 'white' : '#222'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
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
  border: 1px solid #e9e9ef;
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
  height: 38.5px;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
`;

const ArchiveTitle = styled.h2`
  color: #222;
  font-size: var(--font-size-18);
  padding-top: 4px;
  padding-left: 12px;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #6b7280;
  margin-top: 14px;
  padding: 12px;
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
  font-weight: 500;
  margin: 0;
  padding: 16px 24px 12px;
`;

const ArchiveText = styled.span`
  font-size: var(--font-size-14);
  font-weight: 500;
`;

const RightContainer = styled.div`
  flex: 1;
  height: calc(100% - 32px);
  border-radius: 0 25px 25px 0;
  background: var(--color-white);
  margin-top: 32px;
  position: relative;
  flex-shrink: 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 72px;
  padding: 0 32px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
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
  height: calc(100% - 73px);
  position: absolute;
  top: 73px;
  left: 0;
  overflow-y: auto;
  display: flex;
  justify-content: center;
`;

const FileContentWrapper = styled.div`
  width: 100%;
  max-width: 1006px;
  display: flex;
  flex-direction: column;
`;

const FolderIcon = styled.span`
  font-size: var(--font-size-16);
`;

const PageTitle = styled.h1`
  color: #323232;
  font-size: var(--font-size-32);
  font-weight: 700;
  margin: 0;
`;

const Title = styled.h2`
  color: #222;
  font-size: var(--font-size-16);
  font-weight: 600;
  line-height: normal;
  padding: 16px 120px 12px 32px;
`;

const PageDescription = styled.p`
  color: #323232;
  font-size: var(--font-size-18);
  font-weight: 400;
  margin: 0;
  margin-top: 8px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 0; 
  position: absolute;
  top: 72px;
  left: 0;
  right: 0;
`;
