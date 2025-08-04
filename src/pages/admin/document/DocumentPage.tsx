import { useState, useEffect } from "react";
import styled from "styled-components";
import TitleContainer from "../../../layout/TitleContainer";
import DocumentStatCard from "../../../components/admin/document/DocumentStatCard";
import DocumentTable from "../../../components/admin/document/DocumentTable";
import Pagination from "../../../components/common/Pagination";
import { useDocumentStore } from "../../../store/documentStore";

// 문서 관리 페이지
const DocumentPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { formatStatsForDisplay, filteredData } = useDocumentStore();
  const stats = formatStatsForDisplay();
  const itemsPerPage = 4;
  
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
      <TitleContainer title="전체 문서" subtitle="모든 사내 문서를 한 번에 확인하고 정리하세요" />
      <DocumentStatCard stats={stats} />
      <DocumentTable currentPage={currentPage} itemsPerPage={itemsPerPage} />
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
    </Container>
  );
};

export default DocumentPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 48px;
`;