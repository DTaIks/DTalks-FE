import { useState } from "react";
import styled from "styled-components";
import TitleContainer from "../../../layout/TitleContainer";
import DocumentStatCard from "../../../components/admin/document/DocumentStatCard";
import DocumentTable from "../../../components/admin/document/DocumentTable";
import Pagination from "../../../components/common/Pagination";
import useDocumentStats from "../../../hooks/document/useDocumentStats";

const DocumentPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, error, formatStatsForDisplay } = useDocumentStats();
  const stats = formatStatsForDisplay();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Container>
        <TitleContainer title="전체 문서" subtitle="모든 사내 문서를 한 번에 확인하고 정리하세요" />
        <LoadingText>로딩 중...</LoadingText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <TitleContainer title="전체 문서" subtitle="모든 사내 문서를 한 번에 확인하고 정리하세요" />
        <ErrorText>{error}</ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <TitleContainer title="전체 문서" subtitle="모든 사내 문서를 한 번에 확인하고 정리하세요" />
      <DocumentStatCard stats={stats} />
      <DocumentTable />
      <Pagination 
        currentPage={currentPage}
        totalPages={5} // 실제 총 페이지 수로 변경 필요
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

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--color-darkgray);
  font-size: 16px;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 40px;
  color: #ff4444;
  font-size: 16px;
`; 