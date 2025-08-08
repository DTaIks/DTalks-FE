import { useState, useEffect } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import CompareCard from "@/components/common/CompareCard";
import PolicyTable from "@/components/admin/policy/PolicyTable";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import Button from "@/components/common/Button";
import DocumentUploadModal from "@/components/common/DocumentUploadModal";
import { useDocumentStore } from "@/store/documentStore";
import { useFileUpload } from "@/hooks/useFileUpload";

// 사내 정책 관리 페이지
const PolicyPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { filteredData, setSelectedCategory, setSelectedStatus } = useDocumentStore();
  
  // 페이지 진입 시 사내 정책 카테고리로 필터링하고 전체 상태로 설정
  useEffect(() => {
    setSelectedCategory("사내 정책");
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
    modals,
    getButtonText
  } = useFileUpload({
    pageType: 'policy',
    onUpload: (data) => {
      // 사내 정책 파일 업로드 처리
      console.log('사내 정책 업로드:', data);
    },
    onEdit: (data) => {
      // 사내 정책 파일 수정 처리
      console.log('사내 정책 수정:', data);
    },
    onArchive: () => {
      // 보관 처리
    },
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
      <TitleContainer title="사내 정책" subtitle="모든 사내 정책 문서를 한 번에 확인하고 정리하세요" />
      <ButtonContainer>
        <StyledPolicyButton 
          text={getButtonText()} 
          width="var(--button-width)" 
          height="var(--button-height)"
          onClick={handleFileUploadClick}
        />
      </ButtonContainer>
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
      <PolicyTable 
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

      <DocumentUploadModal
        isOpen={uploadModal.isOpen}
        onClose={handleCloseUploadModal}
        onSubmit={handleSubmit}
        pageType="policy"
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        fileName={confirmModal.selectedFileName}
        type={confirmModal.modalType}
      />
    </Container>
  );
};

export default PolicyPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: var(--gap-60);
  margin-left: 888px;
`;

const StyledPolicyButton = styled(Button)`
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
