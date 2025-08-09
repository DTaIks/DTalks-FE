import { useState, useEffect } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import CompareCard from "@/components/common/document/DocumentCompareCard";
import GlossaryTable from "@/components/admin/glossary/GlossaryTable";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import Button from "@/components/common/Button";
import DocumentUploadModal from "@/components/common/DocumentUploadModal";
import { VersionHistoryModal } from "@/components/common/FileVersionManagementModal";
import { useDocumentStore } from "@/store/documentStore";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useCommonHandlers } from "@/hooks/useCommonHandlers";
import { useVersionCompare } from "@/hooks/useVersionCompare";

// 용어사전 관리 페이지
const GlossaryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [versionModal, setVersionModal] = useState({ isOpen: false, fileName: '' });
  const { filteredData, setSelectedCategory, setSelectedStatus } = useDocumentStore();
  
  const { 
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
    clearError 
  } = useVersionCompare({ documentType: 'glossary' });
  
  // 공통 핸들러 사용
  const { handleArchiveByFileName, handleVersionHistoryClick } = useCommonHandlers({
    modals: {
      confirmModal: {
        open: () => {} // 실제로는 사용하지 않음
      },
      versionModal: {
        open: (fileName: string) => setVersionModal({ isOpen: true, fileName }),
        close: () => setVersionModal({ isOpen: false, fileName: '' }),
        isOpen: versionModal.isOpen
      }
    }
  });
  
  // 페이지 진입 시 용어사전 카테고리로 필터링하고 전체 상태로 설정
  useEffect(() => {
    setSelectedCategory("용어 사전");
    setSelectedStatus("전체 상태");
  }, [setSelectedCategory, setSelectedStatus]);

  // 검색값 변경 핸들러
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // 에러가 있다면 새로운 검색 시 클리어
    if (error) {
      clearError();
    }
  };

  // 문서 선택 핸들러
  const handleDocumentSelect = (documentName: string) => {
    selectDocument(documentName);
    if (error) {
      clearError();
    }
  };

  // 히스토리 뷰 처리
  const handleHistoryView = () => {
    if (error) {
      clearError();
    }
  };

  const itemsPerPage = 4;
  
  // 파일 업로드 hook 사용
  const {
    uploadModal,
    confirmModal,
    handleFileUploadClick,
    handleCloseUploadModal,
    handleSubmit,
    handleConfirmAction,
    closeConfirmModal,
    modals: fileUploadModals,
    getButtonText
  } = useFileUpload({
    pageType: 'glossary',
    onUpload: () => {
      // 용어 사전 파일 업로드 처리
    },
    onEdit: () => {
      // 용어 사전 파일 수정 처리
    },
    onArchive: handleArchiveByFileName,
    onDownload: () => {
      // 다운로드 처리
    }
  });
  
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

  return (
    <Container>
      <HeaderWrapper>
        <TitleContainer title="용어사전" subtitle="모든 용어 사전 문서를 한 번에 확인하고 정리하세요" />
        <ButtonContainer>
          <StyledGlossaryButton 
            text={getButtonText()} 
            width="var(--button-width)" 
            height="var(--button-height)"
            onClick={handleFileUploadClick}
          />
        </ButtonContainer>
      </HeaderWrapper>
      <CompareCard 
        documentSuggestions={documentSuggestions}
        versionOptions={versionOptions}
        onSearchChange={handleSearchChange}
        onDocumentSelect={handleDocumentSelect}
        onVersionCompare={compareVersions}
        onHistoryView={handleHistoryView}
        diffData={diffData}
        isLoading={isLoading}
        isLoadingDocuments={isLoadingDocuments}
        isLoadingVersions={isLoadingVersions}
        searchValue={searchValue}
        selectedDocument={selectedDocument}
      />
      <GlossaryTable 
        currentPage={currentPage} 
        itemsPerPage={itemsPerPage}
        modals={{
          ...fileUploadModals,
          handleVersionHistoryClick
        }}
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

      <DocumentUploadModal
        isOpen={uploadModal.isOpen}
        onClose={handleCloseUploadModal}
        onSubmit={handleSubmit}
        pageType="glossary"
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        fileName={confirmModal.selectedFileName}
        type={confirmModal.modalType}
      />

      <VersionHistoryModal
        isOpen={versionModal.isOpen}
        onClose={() => setVersionModal({ isOpen: false, fileName: '' })}
        fileName={versionModal.fileName}
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

const HeaderWrapper = styled.div`
  position: relative;
  width: 1056px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 32px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  height: 64px;
`;

const StyledGlossaryButton = styled(Button)`
  && {
    color: var(--color-white);
    font-family: var(--font-pretendard);
    font-size: var(--font-size-18);
    font-style: normal;
    font-weight: var(--table-header-font-weight);
    line-height: normal;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 24px;
`;
