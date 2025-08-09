import { useState, useEffect } from 'react';
import { type VersionDiffItem } from '@/components/admin/document/DocumentVersionDiffList';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';

interface DocumentVersion {
  versionId: string;
  versionNumber: string;
}

interface DocumentInfo {
  documentName: string;
  description?: string;
  lastModified?: string;
  category: string;
}

interface UseVersionCompareProps {
  documentType?: 'policy' | 'glossary' | 'report';
}

interface UseVersionCompareReturn {
  diffData: VersionDiffItem[];
  documentSuggestions: DocumentInfo[];
  versionOptions: Array<{ value: string; label: string }>;
  isLoading: boolean;
  isLoadingDocuments: boolean;
  isLoadingVersions: boolean;
  error: string | null;
  searchValue: string;
  selectedDocument: string;
  setSearchValue: (value: string) => void;
  selectDocument: (documentName: string) => void;
  compareVersions: (documentName: string, version1: string, version2: string) => Promise<void>;
  clearDiffData: () => void;
  clearError: () => void;
}

export const useVersionCompare = ({ documentType }: UseVersionCompareProps = {}): UseVersionCompareReturn => {
  const [diffData, setDiffData] = useState<VersionDiffItem[]>([]);
  const [documentSuggestions, setDocumentSuggestions] = useState<DocumentInfo[]>([]);
  const [versionOptions, setVersionOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');

  // 디바운스된 검색값
  const { debouncedValue: debouncedSearchValue } = useDebouncedSearch(searchValue, 300);

  // 타입별 더미 데이터
  const getMockDocuments = (searchTerm: string, docType?: string): DocumentInfo[] => {
    const allDocuments: DocumentInfo[] = [
      // 사내 정책 문서들
      { 
        documentName: '인사관리 정책', 
        category: 'policy',
      },
      {
        documentName: '보안 정책', 
        category: 'policy',
      },
      
      // 용어사전 문서들
      {
        documentName: 'IT 용어사전', 
        category: 'glossary',
      },
      {
        documentName: '비즈니스 용어사전', 
        category: 'glossary',
      },

      
      // 보고서 양식 문서들
      {
        documentName: '월간 보고서 양식', 
        category: 'report',
      },
      {
        documentName: '프로젝트 보고서 양식', 
        category: 'report',
      }
    ];

    if (!searchTerm.trim()) return [];

    // 문서 타입에 따라 필터링
    let filteredByType = allDocuments;
    if (docType) {
      filteredByType = allDocuments.filter(doc => doc.category === docType);
    }

    // 검색어가 문서명에 포함되는 경우 필터링
    return filteredByType.filter(doc => 
      doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getMockVersions = (documentName: string): DocumentVersion[] => {
    const versionsByDocument: Record<string, DocumentVersion[]> = {
      // 사내 정책 문서 버전들
      '인사관리 정책': [
        { versionId: '1', versionNumber: 'v 1.0.0'},
        { versionId: '2', versionNumber: 'v 1.1.0'},
        { versionId: '3', versionNumber: 'v 2.0.0'},
      ],
      '보안 정책': [
        { versionId: '1', versionNumber: 'v 1.0.0'},
        { versionId: '2', versionNumber: 'v 1.2.0'},
        { versionId: '3', versionNumber: 'v 2.1.0'},
      ],
      
      // 용어사전 문서 버전들
      'IT 용어사전': [
        { versionId: '1', versionNumber: 'v 1.0.0'},
        { versionId: '2', versionNumber: 'v 1.5.0'},
        { versionId: '3', versionNumber: 'v 2.0.0'},
      ],
      '비즈니스 용어사전': [
        { versionId: '1', versionNumber: 'v 1.0.0'},
        { versionId: '2', versionNumber: 'v 1.3.0'},
      ],
      
      // 보고서 양식 문서 버전들
      '월간 보고서 양식': [
        { versionId: '1', versionNumber: 'v 1.0.0'},
        { versionId: '2', versionNumber: 'v 1.2.0'},
        { versionId: '3', versionNumber: 'v 2.0.0'},
      ],
      '프로젝트 보고서 양식': [
        { versionId: '1', versionNumber: 'v 1.0.0'},
        { versionId: '2', versionNumber: 'v 1.1.0'},
      ]
    };

    return versionsByDocument[documentName] || [];
  };

  const getMockCompareData = (documentName: string, version1: string, version2: string): VersionDiffItem[] => {
    return [
      { content: `# ${documentName}`, changeType: 'equal' },
      { content: `버전 비교: ${version1} → ${version2}`, changeType: 'equal' },
      { content: '새로운 섹션: 고급 설정', changeType: 'insert' },
      { content: '기존 섹션: 기본 설정', changeType: 'delete' },
      { content: '개요: 이 문서는 상세한 가이드를 제공합니다', changeType: 'equal' },
      { content: '추가된 내용: 문제 해결 방법', changeType: 'insert' },
    ];
  };

  // 문서 선택 시 버전 목록 조회
  const selectDocument = async (documentName: string): Promise<void> => {
    setSelectedDocument(documentName);
    setSearchValue(documentName);
    setDocumentSuggestions([]); 
    setIsLoadingVersions(true);
    setError(null);

    try {
      const versions = getMockVersions(documentName);
      
      if (versions.length === 0) {
        setError(`"${documentName}" 문서의 버전을 찾을 수 없습니다.`);
        setVersionOptions([]);
      } else {
        setVersionOptions(versions.map(v => ({ 
          value: v.versionNumber, 
          label: v.versionNumber 
        })));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '버전 목록 조회에 실패했습니다.';
      setError(errorMessage);
      setVersionOptions([]);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  // 디바운스된 검색값이 변경될 때마다 문서 검색
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchValue.trim()) {
        setDocumentSuggestions([]);
        return;
      }

      if (selectedDocument && debouncedSearchValue === selectedDocument) {
        setDocumentSuggestions([]);
        return;
      }

      setIsLoadingDocuments(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // documentType을 전달하여 타입별 필터링
        const documents = getMockDocuments(debouncedSearchValue, documentType);
        setDocumentSuggestions(documents);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '문서 검색에 실패했습니다.';
        setError(errorMessage);
        setDocumentSuggestions([]);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    performSearch();
  }, [debouncedSearchValue, selectedDocument, documentType]);

  // 검색값이 변경되면 문서 선택 상태 리셋 
  useEffect(() => {
    if (searchValue && selectedDocument && searchValue !== selectedDocument) {
      setSelectedDocument('');
      setVersionOptions([]);
    }
  }, [searchValue, selectedDocument]);

  const compareVersions = async (documentName: string, version1: string, version2: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const differences = getMockCompareData(documentName, version1, version2);
      
      setDiffData(differences);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '버전 비교에 실패했습니다.';
      setError(errorMessage);
      setDiffData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearDiffData = () => {
    setDiffData([]);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    diffData,
    documentSuggestions,
    versionOptions,
    isLoading,
    isLoadingDocuments,
    isLoadingVersions,
    error,
    searchValue,
    selectedDocument,
    setSearchValue,
    selectDocument,
    compareVersions,
    clearDiffData,
    clearError,
  };
};
