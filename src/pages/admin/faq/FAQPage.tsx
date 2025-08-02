import { useState } from "react";
import styled from "styled-components";
import TitleContainer from "../../../layout/TitleContainer";
import FAQTable from "../../../components/admin/faq/FAQTable";
import Button from "../../../components/common/Button";
import Pagination from "../../../components/common/Pagination";

const FAQPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 3; // 예시로 3페이지 설정

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    // TODO: 페이지 변경 시 데이터 로딩 로직 추가
    console.log('Page changed to:', page);
  };

  return (
    <Container>
      <TitleContainer title="FAQ 관리" subtitle="자주 묻는 질문들을 관리하고 편집하세요" />
      <ButtonContainer>
        <StyledFAQButton text="FAQ 추가" width="var(--button-width)" height="var(--button-height)" />
      </ButtonContainer>
      <FAQTable />
      <PaginationContainer>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </PaginationContainer>
    </Container>
  );
};

export default FAQPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: var(--gap-60);
  margin-left: 888px;
`;

const StyledFAQButton = styled(Button)`
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
  margin-top: 12px;
  margin-bottom: 48px;
`;