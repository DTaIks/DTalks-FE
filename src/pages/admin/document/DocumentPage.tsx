import { useState, useMemo } from "react";
import styled from "styled-components";
import TitleContainer from "../../../layout/TitleContainer";
import DocumentStatCard from "../../../components/admin/document/DocumentStatCard";
import DocumentTable from "../../../components/admin/document/DocumentTable";
import Pagination from "../../../components/common/Pagination";
import useDocumentStats from "../../../hooks/document/useDocumentStats";

const DocumentPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {formatStatsForDisplay } = useDocumentStats();
  const stats = formatStatsForDisplay();
  const itemsPerPage = 4;

  // 총 페이지 수 계산 (실제 데이터 개수)
  const totalItems = 5; // 실제로는 API에서 받아온 총 데이터 수
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container>
      <TitleContainer title="전체 문서" subtitle="모든 사내 문서를 한 번에 확인하고 정리하세요" />
      <DocumentStatCard stats={stats} />
      <DocumentTable currentPage={currentPage} itemsPerPage={itemsPerPage} />
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default DocumentPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;