import { useState } from "react";
import styled from "styled-components";
import TitleContainer from "../../../layout/TitleContainer";
import FAQTable from "../../../components/admin/faq/FAQTable";
import Button from "../../../components/common/Button";
import Pagination from "../../../components/common/Pagination";
import FAQUploadModal, { type FAQUploadData } from "../../../components/admin/faqModal/FAQUploadModal";

const FAQPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // 페이지당 표시할 FAQ 수
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 전체 FAQ 데이터 (실제로는 API에서 가져올 데이터)
  const totalFAQItems = 8; // 예시 데이터 개수
  const totalPages = Math.ceil(totalFAQItems / itemsPerPage);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    console.log('Page changed to:', page);
  };

  const handleModalOpen = (): void => {
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
  };

  const handleFAQSubmit = (data: FAQUploadData): void => {
    console.log('FAQ 추가:', data);
    // TODO: API 호출하여 FAQ 추가
    handleModalClose();
  };

  return (
    <Container>
      <TitleContainer title="FAQ 관리" subtitle="자주 묻는 질문들을 관리하고 편집하세요" />
      <ButtonContainer>
        <StyledFAQButton 
          text="FAQ 추가" 
          width="var(--button-width)" 
          height="var(--button-height)"
          onClick={handleModalOpen}
        />
      </ButtonContainer>
      <FAQTable 
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
      {totalFAQItems > 0 && (
        <PaginationContainer>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </PaginationContainer>
      )}

      <FAQUploadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFAQSubmit}
      />
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
  align-items: center;
  margin-top: 12px;
  margin-bottom: 48px;
`;