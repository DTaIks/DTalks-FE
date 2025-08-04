import { useState, useEffect } from 'react';

interface DocumentStats {
  totalDocuments: number;
  activeDocuments: number;
  archivedDocuments: number;
}

const useDocumentStats = () => {
  const [stats, setStats] = useState<DocumentStats>({
    totalDocuments: 0,
    activeDocuments: 0,
    archivedDocuments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentStats = async () => {
      try {
        setLoading(true);
        // 실제 API 호출이 여기에 들어갈 예정
        // const response = await documentAPI.getStats();
        
        // 임시 데이터 (나중에 API로 교체)
        const mockData = {
          totalDocuments: 1234,
          activeDocuments: 987,
          archivedDocuments: 247
        };
        
        setStats(mockData);
        setError(null);
      } catch {
        setError('통계 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentStats();
  }, []);

  const formatStatsForDisplay = () => {
    return [
      { 
        title: "총 문서 수", 
        value: `${stats.totalDocuments.toLocaleString()}개`,
        additionalInfo: "+12개 이번 달"
      },
      { 
        title: "활성 문서", 
        value: `${stats.activeDocuments.toLocaleString()}개`,
        additionalInfo: "+5개 이번 주"
      },
      { 
        title: "보관 문서", 
        value: `${stats.archivedDocuments.toLocaleString()}개`,
        additionalInfo: "+2개 이번 달"
      }
    ];
  };

  return {
    stats,
    loading,
    error,
    formatStatsForDisplay
  };
};

export default useDocumentStats; 