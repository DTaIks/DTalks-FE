import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useVersionHistory, useFiles } from '@/hooks/media/useMediaFile';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  fileName
}) => {
  const versions = useVersionHistory(fileName);
  
  const getDisplayFileName = (fileName: string, departmentName?: string) => {
    if (departmentName) {
      return `[${departmentName}] ${fileName}`;
    }
    return fileName;
  };

  // 파일의 부서명을 찾기
  const files = useFiles();
  const currentFile = files.find(file => file.fileName === fileName);
  const displayFileName = getDisplayFileName(fileName, currentFile?.departmentName);
  
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer isOpen={isOpen}>
        <ModalHeader>
          <HeaderContent>
            <ModalTitle>문서 버전 히스토리</ModalTitle>
            <FileName>{displayFileName}</FileName>
          </HeaderContent>
          <CloseButton
            onClick={onClose}
            type="button"
          >
            ✕
          </CloseButton>
        </ModalHeader>
                
        <VersionList>
          {versions.map((version) => (
            <VersionItem key={version.id}>
              <VersionNumber>{version.version}</VersionNumber>
              <VersionInfo>{version.updatedAt} · {version.fileSize} · {version.uploaderName}</VersionInfo>
              {version.description && (
                <VersionDescription>{version.description}</VersionDescription>
              )}
            </VersionItem>
          ))}
        </VersionList>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  z-index: 1050;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ModalContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 480px;
  background-color: var(--color-white);
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  flex-direction: column;
  border-radius: 15px 0 0 15px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--gap-8);
  flex: 1;
`;

const ModalTitle = styled.h2`
  font-size: var(--font-size-20);
  font-weight: var(--font-weight-600);
  color: var(--color-black);
  margin: 0;
`;

const FileName = styled.p`
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-500);
  color: var(--color-gray);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: var(--font-size-20);
  color: #6b7280;
  cursor: pointer;
  padding: var(--padding-8);
  border-radius: var(--br-4);
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    color: #1f2937;
  }
`;

const VersionList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
`;

const VersionItem = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid #f0f0f0;
`;

const VersionNumber = styled.div`
  font-weight: var(--font-weight-600);
  color: #6c64ff;
  font-size: var(--font-size-18);
  margin-bottom: 8px;
`;

const VersionInfo = styled.div`
  font-size: var(--font-size-14);
  color: var(--color-gray);
  margin-bottom: 8px;
`;

const VersionDescription = styled.p`
  font-size: var(--font-size-14);
  color: var(--color-gray);
  margin: 0;
`;
