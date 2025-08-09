import React from 'react';
import styled from 'styled-components';
import VersionDiffList, { type VersionDiffItem } from '@/components/common/document/DocumentVersionDiffList';

interface VersionHistorySectionProps {
  diffData: VersionDiffItem[];
  isLoading: boolean;
  selectedDocument: string;
  version1: string;
  version2: string;
}

const VersionHistorySection: React.FC<VersionHistorySectionProps> = ({
  diffData,
  isLoading,
}) => {
  return (
    <HistoryContent>
      {diffData.length > 0 ? (
        <DiffContainer>
          {diffData.map((item, index) => (
            <VersionDiffList key={index} item={item} />
          ))}
        </DiffContainer>
      ) : (
        <HistoryPlaceholder>
          {isLoading 
            ? '비교 중입니다...'
            : '문서를 선택하고 두 버전을 선택한 후 비교 버튼을 클릭하세요'
          }
        </HistoryPlaceholder>
      )}
    </HistoryContent>
  );
};

export default VersionHistorySection;

const HistoryContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const DiffContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  
  > * {
    margin-bottom: 2px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const HistoryPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 16px;
  text-align: center;
`;
