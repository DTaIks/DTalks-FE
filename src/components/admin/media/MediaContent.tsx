import React from 'react';
import styled from 'styled-components';
import type { MediaFile } from '@/types/media';
import MediaFileContent from './MediaFileContentList';
import Header from './MediaHeader';
import DropdownFilter from '@/components/common/DropDownFilter';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';

interface MediaContentProps {
  selectedDepartment: string;
  selectedFileType: '전체' | '문서' | '이미지' | '음성';
  isArchiveMode: boolean;
  files: MediaFile[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  handlers: {
    handleDownloadClick: (fileName: string, fileUrl?: string) => void;
    handleArchiveClick: (fileName: string) => void;
    handleVersionManagementClick: (fileName: string, fileId?: number) => void;
    handleEditClick: (file: MediaFile) => void;
    handleUploadSubmit: (data: { uploadFile?: File; fileName: string; description: string; fileVersion: string; isPublic: boolean }) => void;
    handleConfirmAction: () => void;
    handleDocumentArchive: (documentId: number) => void;
  };
  onSelectFileType: (fileType: '전체' | '문서' | '이미지' | '음성') => void;
  onPageChange: (page: number) => void;
}

const MediaContent: React.FC<MediaContentProps> = ({
  selectedDepartment,
  selectedFileType,
  isArchiveMode,
  files,
  totalPages,
  currentPage,
  isLoading,
  error,
  handlers,
  onSelectFileType,
  onPageChange
}) => {
  return (
    <RightContainer>
      <HeaderContainer>
        <Header selectedTeam={selectedDepartment} />
        <DropdownWrapper>
          <DropdownFilter 
            options={['전체', '문서', '이미지', '음성'] as const}
            defaultValue={selectedFileType}
            onSelect={onSelectFileType}
            placeholder="파일 유형"
          />
        </DropdownWrapper>
      </HeaderContainer>

      <FileContainer>
        <FileContentWrapper>
          {isLoading ? (
            <LoadingText>파일 목록을 불러오는 중...</LoadingText>
          ) : error ? (
            <EmptyState 
              message="파일 목록을 불러오는데 실패했습니다"
              subMessage="잠시 후 다시 시도해주세요."
            />
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
              onPageChange={onPageChange}
            />
          </PaginationContainer>
        )}
      </FileContainer>
    </RightContainer>
  );
};

export default MediaContent;

// Styled Components
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

const LoadingText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: var(--color-gray);
  font-size: var(--font-size-14);
`;
