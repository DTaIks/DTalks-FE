import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import GlossaryStatCard from "@/components/admin/glossary/GlossaryStatCard";
import GlossaryTable from "@/components/admin/glossary/GlossaryTable";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useGlossaryStore } from "@/store/glossaryStore";

// 용어사전 관리 페이지
const GlossaryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { formatStatsForDisplay, filteredData } = useGlossaryStore();
  const stats = formatStatsForDisplay();
  const itemsPerPage = 4;
  
  // 모달 상태 관리
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'archive' | 'download'>('download');
  const [selectedFileName, setSelectedFileName] = useState('');
  
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

  // 모달 핸들러들
  const openConfirmModal = useCallback((type: 'archive' | 'download', fileName: string) => {
    setModalType(type);
    setSelectedFileName(fileName);
    setIsConfirmModalOpen(true);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setSelectedFileName('');
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (modalType === 'archive') {
      // 보관 로직은 GlossaryTable에서 직접 처리됨
      console.log(`${selectedFileName} 보관 처리`);
    } else if (modalType === 'download') {
      console.log(`${selectedFileName} 다운로드 처리`);
    }
    closeConfirmModal();
  }, [modalType, selectedFileName, closeConfirmModal]);

  const modals = {
    confirmModal: {
      open: openConfirmModal,
      close: closeConfirmModal
    }
  };

  return (
    <Container>
      <TitleContainer title="용어사전" subtitle="모든 용어사전 문서를 한 번에 확인하고 정리하세요" />
      <GlossaryStatCard stats={stats} />
      <GlossaryTable 
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
    </Container>
  );
};

export default GlossaryPage;

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
