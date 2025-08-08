import React from "react";
import styled from 'styled-components';
import DropDownButton from "@/components/common/DropDownButton";
import type { MediaFile } from "@/hooks/media/useMediaFile";

interface MediaFileContentProps {
  file: MediaFile;
  isArchiveMode?: boolean;
  handlers: { 
    handleDownloadClick: (fileName: string) => void;
    handleArchiveClick: (fileName: string) => void;
    handleVersionManagementClick: (fileName: string) => void;
    handleEditClick: (file: MediaFile) => void;
    handleUploadSubmit: (data: { fileName: string; description: string; fileVersion: string; isPublic: boolean }) => void;
    handleConfirmAction: () => void;
    handleDocumentArchive: (documentId: number) => void;
  };
}

const MediaFileContent: React.FC<MediaFileContentProps> = ({ 
  file,
  isArchiveMode = false,
  handlers
}) => {

  const formatDate = (updatedAt: string) => {
    return updatedAt;
  };

  const dropdownItems = [
    {
      label: "다운로드",
      onClick: () => handlers.handleDownloadClick(file.fileName)
    },
    {
      label: "수정",
      onClick: () => handlers.handleEditClick(file)
    },
    {
      label: "보관하기",
      onClick: () => handlers.handleArchiveClick(file.fileName)
    },
    {
      label: "버전 관리",
      onClick: () => handlers.handleVersionManagementClick(file.fileName)
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
