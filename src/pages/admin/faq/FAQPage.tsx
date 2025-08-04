import { useState, useEffect } from "react";
import styled from "styled-components";
import TitleContainer from "../../../layout/TitleContainer";
import FAQTable from "../../../components/admin/faq/FAQTable";
import Button from "../../../components/common/Button";
import Pagination from "../../../components/common/Pagination";
import FAQUploadModal, { type FAQUploadData } from "../../../components/admin/faq/FAQUploadModal";
import { useFAQStore } from "../../../store/faqStore";

// FAQ 관리 페이지
const FAQPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const itemsPerPage = 4;

  const { filteredData } = useFAQStore();
  
  const totalItems = filteredData.length;
  const totalPages = totalItems <= itemsPerPage ? 1 : Math.ceil(totalItems / itemsPerPage);
  
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleModalOpen = (): void => {
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
  };

  const handleFAQSubmit = (data: FAQUploadData): void => {
    console.log('FAQ 추가:', data);
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

