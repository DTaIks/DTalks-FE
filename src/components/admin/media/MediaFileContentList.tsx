import React from "react";
import styled from 'styled-components';
import DropDownButton from "../../common/DropDownButton";
import type { MediaFile } from "../../../hooks/media/useMediaFile";

interface MediaFileContentProps {
  file: MediaFile;
  isArchiveMode?: boolean;
  onDownloadClick?: () => void;
  onArchiveClick?: () => void;
  onEditClick?: () => void;
  onVersionManagementClick?: () => void;
}

const MediaFileContent: React.FC<MediaFileContentProps> = ({ 
  file, 
  isArchiveMode = false,
  onDownloadClick,
  onArchiveClick,
  onEditClick,
  onVersionManagementClick
}) => {
  const formatDate = (updatedAt: string) => {
    return updatedAt;
  };

  const dropdownItems = [
    {
      label: "다운로드",
      onClick: onDownloadClick || (() => console.log("다운로드 클릭"))
    },
    {
      label: "수정",
      onClick: onEditClick || (() => console.log("수정 클릭"))
    },
    {
      label: "보관하기",
      onClick: onArchiveClick || (() => console.log("보관하기 클릭"))
    },
    {
      label: "버전 관리",
      onClick: onVersionManagementClick || (() => console.log("버전관리 클릭"))
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
  width: 780px;
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
  font-weight: var(--font-weight-600);
  color: #222;
  margin: 0;
  padding-bottom: 5px;
`;

const FileMetadata = styled.p`
  font-size: var(--font-size-12);
  color: var(--color-gray);
  margin: 0;
`;

const Department = styled.span`
  color: var(--color-gray);
  font-weight: var(--font-weight-500);
`;

const MenuButton = styled.div`
  display: flex;
  align-items: center;
`;
