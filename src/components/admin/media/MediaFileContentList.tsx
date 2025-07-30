import React from "react";
import styled from 'styled-components';
import DropDownButton from "../../common/DropDownButton";
import type { MediaFile } from "../../../hooks/useMediaFile";

interface MediaFileContentProps {
  file: MediaFile;
  onDownloadClick?: () => void;
  onArchiveClick?: () => void;
  isArchiveMode?: boolean;
}

const MediaFileContent: React.FC<MediaFileContentProps> = ({ 
  file,
  onDownloadClick,
  onArchiveClick,
  isArchiveMode = false
}) => {
  const formatDate = (updatedAt: string) => {
    return updatedAt;
  };

  const dropdownItems = [
    {
      label: '다운로드',
      onClick: onDownloadClick || (() => {}),
    },
    {
      label: '버전 관리',
      onClick: () => console.log('버전 관리 클릭:', file.fileName),
    },
    {
      label: '보관',
      onClick: onArchiveClick || (() => {}),
    }
  ];

  return (
    <Container>
      <FileInfo>
        <FileDetails>
          <FileName>{file.fileName}</FileName>
          <FileMetadata>
            {file.fileSize} · {formatDate(file.updatedAt)}
            {file.departmentName && (
              <Department> · {file.departmentName}</Department>
            )}
          </FileMetadata>
        </FileDetails>
      </FileInfo>
      {!isArchiveMode && (
        <MenuButton>
          <DropDownButton items={dropdownItems} />
        </MenuButton>
      )}
    </Container>
  );
};

export default MediaFileContent;

const Container = styled.div`
  width: 800px;
  height: 88px;
  flex-shrink: 0;
  background: var(--color-white);
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px;
  margin-bottom: 1px;
       
  &:hover {
    background: rgba(153, 102, 204, 0.05);
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-16);
  padding-left: 16px;
`;

const FileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
`;

const FileName = styled.h3`
  font-size: var(--font-size-16);
  font-weight: 600;
  color: #222;
  margin: 0;
  padding-bottom: 5px;
`;

const FileMetadata = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;
`;

const Department = styled.span`
  color: #666;
  font-weight: 500;
`;

const MenuButton = styled.div`
  display: flex;
  align-items: center;
`;
