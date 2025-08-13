import React, { useState } from 'react';
import styled from 'styled-components';
import { useCompareStore } from '@/store/compareStore';
import { type VersionDiffItem } from '@/components/common/document/DocumentVersionDiffList';
import { useSearchDocumentsByName, useDocumentVersions } from '@/query/useDocumentQueries';
import DocumentSearch from './DocumentSearch';
import VersionCompareSection from './DocumentVersionCompare';
import VersionHistorySection from './DocumentVersionHistory';

interface DocumentInfo {
  documentName: string;
  description?: string;
  lastModified?: string;
}

interface CompareCardProps {
  category: 'policy' | 'glossary' | 'reportform';
  onVersionCompare?: (documentName: string, version1: string, version2: string) => void;
  diffData?: VersionDiffItem[];
  isComparingVersions?: boolean;
}

type TabType = 'compare' | 'history';

const CompareCard: React.FC<CompareCardProps> = ({
  category,
  onVersionCompare,
  diffData = [],
  isComparingVersions = false
}) => {
  const { activeTab, setActiveTab } = useCompareStore();
  const [searchValue, setSearchValue] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [compareResult, setCompareResult] = useState<{
    version1: string;
    version2: string;
  }>({ version1: '', version2: '' });

  // 문서 검색 API 호출
  const {
    data: searchData,
    isLoading: isLoadingDocuments,
    isDebouncing
  } = useSearchDocumentsByName(
    category,
    searchValue,
    searchValue.trim().length > 0
  );

  // 선택된 문서의 버전 목록 조회
  const {
    data: versionData,
    isLoading: isLoadingVersions
  } = useDocumentVersions(
    category,
    selectedDocument,
    !!selectedDocument
  );

  // 문서 검색 결과를 DocumentInfo 형태로 변환
  const documentSuggestions: DocumentInfo[] = React.useMemo(() => {
    if (!searchData?.documents) return [];
    
    return searchData.documents.map(doc => ({
      documentName: doc.documentName,
      description: `문서 ID: ${doc.documentId}`,
      lastModified: doc.versions?.[0]?.createdAt || ''
    }));
  }, [searchData]);

  // 버전 옵션을 선택 가능한 형태로 변환
  const versionOptions = React.useMemo(() => {
    if (!versionData?.versions) return [];
    
    return versionData.versions.map(version => ({
      value: version.versionId.toString(),
      label: `v ${version.versionNumber}`
    }));
  }, [versionData]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (selectedDocument && !value.includes(selectedDocument)) {
      setSelectedDocument('');
      setCompareResult({ version1: '', version2: '' });
    }
  };

  const handleDocumentSelect = (documentName: string) => {
    setSelectedDocument(documentName);
    setSearchValue(documentName);
    setCompareResult({ version1: '', version2: '' });
  };

  const handleVersionCompare = (documentName: string, version1: string, version2: string) => {
    setCompareResult({ version1, version2 });
    onVersionCompare?.(documentName, version1, version2);
    setActiveTab('history');
  };

  // 검색 중이거나 버전 로딩 중인 상태 계산
  const isSearching = isLoadingDocuments || isDebouncing;

  return (
    <Container $activeTab={activeTab}>
      <TabContainer>
        <Tab 
          $isActive={activeTab === 'compare'}
          onClick={() => handleTabChange('compare')}
        >
          버전 비교
        </Tab>
        <Tab 
          $isActive={activeTab === 'history'}
          onClick={() => handleTabChange('history')}
        >
          히스토리
        </Tab>
      </TabContainer>
      
      <ContentContainer $activeTab={activeTab}>
        {activeTab === 'compare' && (
          <CompareRow>
            <DocumentSearch
              searchValue={searchValue}
              documentSuggestions={documentSuggestions}
              isLoadingDocuments={isSearching}
              onSearchChange={handleSearchChange}
              onDocumentSelect={handleDocumentSelect}
              selectedDocument={selectedDocument}
            />
            
            <VersionCompareSection
              versionOptions={versionOptions}
              isLoadingVersions={isLoadingVersions}
              isLoading={isComparingVersions}
              selectedDocument={selectedDocument}
              onVersionCompare={handleVersionCompare}
            />
          </CompareRow>
        )}
        
        {activeTab === 'history' && (
          <VersionHistorySection
            diffData={diffData}
            isLoading={isComparingVersions}
            selectedDocument={selectedDocument}
            version1={compareResult.version1}
            version2={compareResult.version2}
          />
        )}
      </ContentContainer>
    </Container>
  );
};

export default CompareCard;

const Container = styled.div<{ $activeTab: TabType }>`
  width: 1062px;
  height: ${props => props.$activeTab === 'history' ? '650px' : '140px'};
  flex-shrink: 0;
  border-radius: 18px;
  background: #FFF;
  box-shadow: 0 0 11.25px 2.25px rgba(153, 102, 204, 0.05);
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  position: relative;
  transition: height 0.3s ease;
  overflow: ${props => props.$activeTab === 'history' ? 'hidden' : 'visible'};
`;

const TabContainer = styled.div`
  display: flex;
  padding: 16px 24px 0 24px;
  border-bottom: 1px solid #E5E5E5;
  flex-shrink: 0;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  padding: 8px 16px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: ${props => props.$isActive ? '#9966CC' : '#666'};
  border-bottom: 2px solid ${props => props.$isActive ? '#9966CC' : 'transparent'};
  margin-bottom: -1px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #9966CC;
  }
`;

const ContentContainer = styled.div<{ $activeTab: TabType }>`
  flex: 1;
  display: flex;
  align-items: ${props => props.$activeTab === 'history' ? 'stretch' : 'center'};
  justify-content: center;
  padding: 16px 24px;
  min-height: 0;
  overflow: ${props => props.$activeTab === 'history' ? 'hidden' : 'visible'};
`;

const CompareRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
`;