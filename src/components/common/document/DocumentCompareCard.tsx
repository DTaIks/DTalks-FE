import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { type VersionDiffItem } from '@/components/common/document/DocumentVersionDiffList';
import { useSearchDocumentsByName, useDocumentVersions, useDocumentVersionCompare } from '@/query/useDocumentQueries';
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
}

type TabType = 'compare' | 'history';

const CompareCard: React.FC<CompareCardProps> = ({
  category,
  onVersionCompare
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('compare');
  const [searchValue, setSearchValue] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [compareError, setCompareError] = useState<string>(''); 
  
  const [compareResult, setCompareResult] = useState<{
    version1: string;
    version2: string;
    diffData: VersionDiffItem[];
    compareStats?: {
      insertCount: number;
      deleteCount: number;
      originalVersion: number;
      revisedVersion: number;
    };
  }>({ 
    version1: '', 
    version2: '', 
    diffData: [],
    compareStats: undefined
  });

  useEffect(() => {
    setActiveTab('compare');
    setSearchValue('');
    setSelectedDocument('');
    setCompareError(''); 
    setCompareResult({ 
      version1: '', 
      version2: '', 
      diffData: [],
      compareStats: undefined
    });
  }, [category]);

  // 문서 검색
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

  // 버전 비교 뮤테이션
  const versionCompareMutation = useDocumentVersionCompare();

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
      label: `v ${version.versionNumber}`,
      versionId: version.versionId,
      versionNumber: version.versionNumber,
      createdAt: version.createdAt,
      uploader: version.uploader
    }));
  }, [versionData]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCompareError(''); 
    if (selectedDocument && !value.includes(selectedDocument)) {
      setSelectedDocument('');
      setCompareResult({ 
        version1: '', 
        version2: '', 
        diffData: [],
        compareStats: undefined
      });
      setActiveTab('compare');
    }
  };

  const handleDocumentSelect = (documentName: string) => {
    setSelectedDocument(documentName);
    setSearchValue(documentName);
    setCompareError('');
    setCompareResult({ 
      version1: '', 
      version2: '', 
      diffData: [],
      compareStats: undefined
    });
    setActiveTab('compare');
  };

  const handleVersionCompare = async (documentName: string, version1: string, version2: string) => {
    setCompareError('');

    // 같은 버전 비교 체크
    if (version1 === version2) {
      setCompareError('같은 버전은 비교할 수 없습니다.');
      return;
    }

    if (!versionData?.documentInfo?.documentId) {
      setCompareError('문서 ID를 찾을 수 없습니다.');
      return;
    }

    try {
      const compareResponse = await versionCompareMutation.mutateAsync({
        fileId: versionData.documentInfo.documentId,
        oldVersionId: parseInt(version1),
        newVersionId: parseInt(version2)
      });

      const diffData: VersionDiffItem[] = compareResponse.diff.map(item => ({
        lineNumber: item.lineNumber,
        changeType: item.changeType,
        content: item.content
      }));

      setCompareResult({
        version1,
        version2,
        diffData,
        compareStats: {
          insertCount: compareResponse.insertCount,
          deleteCount: compareResponse.deleteCount,
          originalVersion: compareResponse.originalVersion,
          revisedVersion: compareResponse.revisedVersion
        }
      });

      // 외부 콜백 호출
      onVersionCompare?.(documentName, version1, version2);
      setActiveTab('history');
    } catch (error) {
      console.error('버전 비교 실패:', error);
      
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
      if (axiosError?.response?.status === 404) {
        if (axiosError?.response?.data?.message?.includes('비교할 버전')) {
          setCompareError('같은 버전은 비교할 수 없습니다.');
        } else {
          setCompareError('비교할 버전을 찾을 수 없습니다.');
        }
      } else {
        setCompareError('버전 비교 중 오류가 발생했습니다.');
      }
      
      setCompareResult({ 
        version1: '', 
        version2: '', 
        diffData: [],
        compareStats: undefined
      });
    }
  };

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
              isLoading={versionCompareMutation.isPending}
              selectedDocument={selectedDocument}
              onVersionCompare={handleVersionCompare}
              compareError={compareError}
            />
          </CompareRow>
        )}
        
        {activeTab === 'history' && (
          <VersionHistorySection
            diffData={compareResult.diffData}
            isLoading={versionCompareMutation.isPending}
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
  height: ${props => props.$activeTab === 'history' ? '640px' : '140px'};
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