import { useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import DocumentAllStatCard from "@/components/admin/documentAll/DocumentAllStatCard";
import DocumentAllTable from "@/components/admin/documentAll/DocumentAllTable";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { VersionHistoryModal } from "@/components/common/FileVersionManagementModal";
import { useDocumentStore } from "@/store/documentStore";
import { useDocumentAllList } from "@/query/useDocumentAllQueries";
import { useDocumentCountByCategory, useRecentUpdateCountByCategory, useActiveDocumentCountByCategory } from "@/query/useDocumentQueries";


// 전체 문서 관리 페이지
const DocumentAllPage = () => {
  
  // 전체 문서 수 조회
  const { data: totalCount } = useDocumentCountByCategory('all');
  
  // 최근 업데이트 문서 수 조회
  const { data: recentUpdateCount } = useRecentUpdateCountByCategory('all');
  
  // 활성 문서 수 조회
  const { data: activeCount } = useActiveDocumentCountByCategory('all');
  
  // API 데이터로 통계 생성
  const stats = [
    {
      title: "전체 문서",
      value: totalCount?.documentCount?.toString() || "0",
      additionalInfo: "총 문서수"
    },
    {
      title: "최근 업데이트 문서 수",
      value: `${recentUpdateCount?.documentCount || 0}개`,
      additionalInfo: "+1개 이번 주"
    },
    {
      title: "활성 문서 수",
      value: `${activeCount?.documentCount || 0}개`,
      additionalInfo: "+1개 이번 달"
    }
  ];
  
  // 페이지 진입 시 전체 상태로 설정
  useEffect(() => {
    const { setSelectedStatus, setSelectedCategory } = useDocumentStore.getState();
    setSelectedStatus("전체 상태");
    setSelectedCategory("전체 카테고리");
  }, []);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'archive' as 'archive' | 'download', fileName: '' });
  const [versionModal, setVersionModal] = useState({ isOpen: false, fileName: '' });
  
  // 전체 문서 쿼리 사용
  const { data: documentData, isLoading, error } = useDocumentAllList(currentPage);
  
  const documents = documentData?.documentInfoResponseList || [];
  const totalPages = documentData?.pagingInfo?.totalPageCount || 1;
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  const openConfirmModal = (type: 'archive' | 'download', fileName: string) => {
    setConfirmModal({ isOpen: true, type, fileName });
  };
  
  const closeConfirmModal = useCallback(() => {
    setConfirmModal({ isOpen: false, type: 'archive', fileName: '' });
  }, []);
  
  const openVersionModal = (fileName: string) => {
    setVersionModal({ isOpen: true, fileName });
  };
  
  const closeVersionModal = () => {
    setVersionModal({ isOpen: false, fileName: '' });
  };
  
  useEffect(() => {
    if (currentPage > totalPages) {
      handlePageChange(1);
    }
  }, [totalPages, currentPage, handlePageChange]);

  const handleConfirmAction = useCallback(() => {
    if (confirmModal.type === 'archive') {
      // 실제 보관 처리 로직
      const { archiveDocumentItem } = useDocumentStore.getState();
      // 파일명으로 문서 ID를 찾아서 보관 처리
      const documentToArchive = useDocumentStore.getState().documentItems.find(
        doc => doc.documentName === confirmModal.fileName
      );
      if (documentToArchive) {
        archiveDocumentItem(documentToArchive.documentId);
      }
    } else if (confirmModal.type === 'download') {
      console.log(`${confirmModal.fileName} 다운로드 처리`);
    }
    closeConfirmModal();
  }, [confirmModal.type, confirmModal.fileName, closeConfirmModal]);

  const modals = {
    confirmModal: {
      open: openConfirmModal,
      close: closeConfirmModal
    },
    versionModal: {
      open: openVersionModal,
      close: closeVersionModal,
      isOpen: versionModal.isOpen
    }
  };

  return (
    <Container>
      <HeaderWrapper>
        <TitleContainer title="전체 문서" subtitle="모든 사내 문서를 한 번에 확인하고 정리하세요" />
      </HeaderWrapper>
      <DocumentAllStatCard stats={stats} />
      <DocumentAllTable 
        documents={documents}
        modals={modals}
        isLoading={isLoading}
        error={error}
      />
      {totalPages >= 1 && (
        <PaginationContainer>
          <Pagination
            key={totalPages}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </PaginationContainer>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        fileName={confirmModal.fileName}
        type={confirmModal.type}
      />

      <VersionHistoryModal
        isOpen={versionModal.isOpen}
        onClose={closeVersionModal}
        fileName={versionModal.fileName}
      />
    </Container>
  );
};

export default DocumentAllPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  position: relative;
  width: 1056px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 32px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 24px;
`;


