import { useState, useEffect } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import CompareCard from "@/components/common/CompareCard";
import ReportFormTable from "@/components/admin/report/ReportFormTable";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import Button from "@/components/common/Button";
import DocumentUploadModal from "@/components/common/DocumentUploadModal";
import { VersionHistoryModal } from "@/components/common/FileVersionManagementModal";
import { useDocumentStore } from "@/store/documentStore";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useCommonHandlers } from "@/hooks/useCommonHandlers";

// 보고서 양식 관리 페이지
const ReportFormPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [versionModal, setVersionModal] = useState({ isOpen: false, fileName: '' });
  const { filteredData, setSelectedCategory, setSelectedStatus } = useDocumentStore();
  
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
  
  // 페이지 진입 시 보고서 양식 카테고리로 필터링하고 전체 상태로 설정
  useEffect(() => {
    setSelectedCategory("보고서 양식");
    setSelectedStatus("전체 상태");
  }, [setSelectedCategory, setSelectedStatus]);
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
    pageType: 'report',
    onUpload: () => {
      // 보고서 양식 파일 업로드 처리
    },
    onEdit: () => {
      // 보고서 양식 파일 수정 처리
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
        <TitleContainer title="보고서 양식" subtitle="모든 보고서 양식 문서를 한 번에 확인하고 정리하세요" />
        <ButtonContainer>
          <StyledReportFormButton 
            text={getButtonText()} 
            width="var(--button-width)" 
            height="var(--button-height)"
            onClick={handleFileUploadClick}
          />
        </ButtonContainer>
      </HeaderWrapper>
      <CompareCard 
        showVersionCompare={true}
        versionOptions={[
          { value: "v1.0.0", label: "v1.0.0" },
          { value: "v1.1.0", label: "v1.1.0" },
          { value: "v2.0.0", label: "v2.0.0" },
          { value: "v2.1.0", label: "v2.1.0" }
        ]}
        onSearch={() => {
          // 검색 처리
        }}
        onVersionCompare={() => {
          // 버전 비교 처리
        }}
      />
      <ReportFormTable 
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
        pageType="report"
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

export default ReportFormPage;

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

const StyledReportFormButton = styled(Button)`
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
