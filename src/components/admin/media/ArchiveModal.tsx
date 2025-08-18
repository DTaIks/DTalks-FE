import React from 'react';
import styled from 'styled-components';
import DepartmentBox from '@/components/admin/media/DepartmentList';
import type { MediaArchiveModalProps } from '@/types/media';

const ArchiveModal: React.FC<MediaArchiveModalProps> = ({
  isOpen,
  isClosing,
  departments,
  selectedDepartment,
  onClose,
  onSelectDepartment
}) => {
  return (
    <ArchiveModalContainer className={isOpen ? (isClosing ? 'close' : 'show') : ''}>
      <ArchiveHeader>
        <ArchiveTitle>보관함</ArchiveTitle>
        <CloseButton onClick={onClose}>
          ✕
        </CloseButton>
      </ArchiveHeader>
      
      <ArchiveContent>
        <ArchiveSubtitle>보관된 항목</ArchiveSubtitle>
        <DepartmentListContainer>
          {departments.map((dept) => (
            <DepartmentBox 
              key={`archive-${dept.id}`}
              title={dept.name}
              icon={<FolderIcon>📁</FolderIcon>}
              isSelected={selectedDepartment === dept.name}
              onClick={() => onSelectDepartment(dept.name)}
            />
          ))}
        </DepartmentListContainer>
      </ArchiveContent>
    </ArchiveModalContainer>
  );
};

export default ArchiveModal;

// Styled Components
const ArchiveModalContainer = styled.div`
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

const DepartmentListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
`;

const FolderIcon = styled.span`
  font-size: var(--font-size-16);
`;
