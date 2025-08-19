import React from 'react';
import styled from 'styled-components';
import DepartmentBox from '@/components/admin/media/DepartmentList';
import ArchiveModal from '@/components/admin/media/ArchiveModal';
import type { MediaSidebarProps } from '@/types/media';

const MediaSidebar: React.FC<MediaSidebarProps> = ({
  departments,
  selectedDepartment,
  isArchiveMode,
  isArchiveClosing,
  onSelectDepartment,
  onToggleArchive,
  onSelectArchiveDepartment
}) => {
  return (
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
            onClick={() => onSelectDepartment(dept.name)}
          />
        ))}
      </DepartmentListContainer>
      <Footer onClick={() => onToggleArchive(true)} $isSelected={isArchiveMode}>
        <ArchiveText>보관함</ArchiveText>
      </Footer>
      
      <ArchiveModal
        isOpen={isArchiveMode}
        isClosing={isArchiveClosing}
        departments={departments}
        selectedDepartment={selectedDepartment}
        onClose={() => onToggleArchive(false)}
        onSelectDepartment={onSelectArchiveDepartment}
      />
    </LeftContainer>
  );
};

export default MediaSidebar;

// Styled Components
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

const Footer = styled.div<{ $isSelected: boolean }>`
  padding: 16px 16px 16px 34px;
  height: 30px;
  border-top: 1px solid #e0e0e0;
  border-radius: 0 0 0 25px;
  color: ${props => props.$isSelected ? 'white' : '#222'};
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



const ArchiveText = styled.span`
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-600);
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
