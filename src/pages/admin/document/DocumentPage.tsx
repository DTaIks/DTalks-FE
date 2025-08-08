import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import DocumentStatCard from "@/components/admin/document/DocumentStatCard";
import DocumentTable from "@/components/admin/document/DocumentTable";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { VersionHistoryModal } from "@/components/common/FileVersionManagementModal";
import { useDocumentStore } from "@/store/documentStore";

// 문서 관리 페이지
const DocumentPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { getFormattedStats, filteredData } = useDocumentStore();
  const stats = getFormattedStats();
  const itemsPerPage = 4;
  
  // 페이지 진입 시 전체 상태로 설정
  useEffect(() => {
    const { setSelectedStatus, setSelectedCategory } = useDocumentStore.getState();
    setSelectedStatus("전체 상태");
    setSelectedCategory("전체 카테고리");
  }, []);
  
  // 확인 모달 상태 관리
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'archive' | 'download'>('download');
  const [selectedFileName, setSelectedFileName] = useState('');
  
  // 버전 모달 상태 관리
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [versionFileName, setVersionFileName] = useState('');
  
  const totalItems = filteredData.length;
  const totalPages = totalItems <= itemsPerPage ? 1 : Math.ceil(totalItems / itemsPerPage);
  
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 확인 모달 핸들러들
  const openConfirmModal = useCallback((type: 'archive' | 'download', fileName: string) => {
    setModalType(type);
    setSelectedFileName(fileName);
    setIsConfirmModalOpen(true);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setSelectedFileName('');
  }, []);

  // 버전 모달 핸들러들 추가
  const openVersionModal = useCallback((fileName: string) => {
    setVersionFileName(fileName);
    setIsVersionModalOpen(true);
  }, []);

  const closeVersionModal = useCallback(() => {
    setIsVersionModalOpen(false);
    setVersionFileName('');
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (modalType === 'archive') {
      // 실제 보관 처리 로직
      const { archiveDocumentItem } = useDocumentStore.getState();
      // 파일명으로 문서 ID를 찾아서 보관 처리
      const documentToArchive = useDocumentStore.getState().documentItems.find(
        doc => doc.documentName === selectedFileName
      );
      if (documentToArchive) {
        archiveDocumentItem(documentToArchive.documentId);
      }
    } else if (modalType === 'download') {
      console.log(`${selectedFileName} 다운로드 처리`);
    }
    closeConfirmModal();
  }, [modalType, selectedFileName, closeConfirmModal]);

  const modals = {
    confirmModal: {
      open: openConfirmModal,
      close: closeConfirmModal
    },
    versionModal: {
      open: openVersionModal,
      close: closeVersionModal,
      isOpen: isVersionModalOpen
    }
  };

  return (
    <Container>
      <TitleContainer title="전체 문서" subtitle="모든 사내 문서를 한 번에 확인하고 정리하세요" />
      <DocumentStatCard stats={stats} />
      <DocumentTable 
        currentPage={currentPage} 
        itemsPerPage={itemsPerPage}
        modals={modals}
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
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        fileName={selectedFileName}
        type={modalType}
      />

      <VersionHistoryModal
        isOpen={isVersionModalOpen}
        onClose={closeVersionModal}
        fileName={versionFileName}
      />
    </Container>
  );
};

export default DocumentPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 24px;
`;
