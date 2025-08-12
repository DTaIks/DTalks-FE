import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import CompareCard from "@/components/common/document/DocumentCompareCard";
import CommonTable from "@/components/common/table/CommonTable";
import { useDocumentList } from "@/query/useDocumentQueries";
import { useVersionCompare } from "@/hooks/useVersionCompare";
import type { DocumentTableProps } from "@/types/table";

const DocumentTable: React.FC<DocumentTableProps> = ({ 
  category, 
  title, 
  categoryImage,
  onArchive,
  onVersionHistoryClick,
  onConfirmModalOpen,
  onUpdate,
  onDocumentsLoaded
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // 문서 API 쿼리 사용
  const { data: documentData, isLoading: isLoadingDocument } = useDocumentList(currentPage, category);
  
  // 버전 비교 훅 사용
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
  } = useVersionCompare({ documentType: category as 'policy' | 'glossary' | 'report' });
  
  // 로컬 상태로 검색 및 필터링 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("전체 상태");

  // API 데이터에서 문서 목록 추출
  const documentList = useMemo(() => documentData?.documentInfoResponseList || [], [documentData?.documentInfoResponseList]);
  const totalPages = documentData?.pagingInfo?.totalPageCount || 1;
  
  // 문서 목록이 로드되면 부모 컴포넌트에 전달
  useEffect(() => {
    if (onDocumentsLoaded && documentList.length > 0) {
      onDocumentsLoaded(documentList);
    }
  }, [documentList, onDocumentsLoaded]);
  
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);



  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const handleArchive = (id: number, isArchived?: boolean) => {
    if (onArchive) {
      onArchive(id, isArchived);
    }
  };

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

  return (
    <Container>
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
      <CommonTable
        title={`${title} 목록`}
        items={documentList}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        onSearchChange={handleSearch}
        onStatusChange={handleStatusChange}
        onArchive={handleArchive}
        onUpdate={onUpdate}
        categoryImage={categoryImage}
        modals={{
          confirmModal: {
            open: onConfirmModalOpen || (() => {})
          },
          handleVersionHistoryClick: onVersionHistoryClick
        }}
        isLoading={isLoadingDocument}
      />
    </Container>
  );
};

export default DocumentTable;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
