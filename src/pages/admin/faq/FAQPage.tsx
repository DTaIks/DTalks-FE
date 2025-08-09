import { useState, useEffect } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import FAQTable from "@/components/admin/faq/table/FAQTable";
import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import FAQUploadModal, { type FAQUploadData } from "@/components/admin/faq/FAQUploadModal";

import { useFAQList, useFAQSearch } from "@/hooks/faq/useFAQQueries";
import { useCreateFAQ } from "@/hooks/faq/useFAQMutations";
import { useFAQStore } from "@/store/faqStore";

// FAQ 관리 페이지
const FAQPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 검색 상태 확인
  const { searchTerm, setSearchTerm } = useFAQStore();
  
  // FAQ 추가 뮤테이션
  const createFAQMutation = useCreateFAQ();
  
  // 검색 여부에 따른 API 호출
  const isSearchMode = searchTerm.trim().length > 0;
  
  // 일반 목록 조회
  const { data: faqListResponse, isLoading: isListLoading, error: listError } = useFAQList(currentPage);
  
  // 검색 조회
  const { data: faqSearchResponse, isLoading: isSearchLoading, error: searchError, isDebouncing } = useFAQSearch(
    searchTerm,
    currentPage,
    isSearchMode
  );
  
  // 현재 모드에 따른 데이터 선택
  const currentResponse = isSearchMode ? faqSearchResponse : faqListResponse;
  const currentLoading = isSearchMode ? (isSearchLoading || isDebouncing) : isListLoading;
  const currentError = isSearchMode ? searchError : listError;
  
  // API 응답에서 필요한 데이터 추출
  const faqItems = currentResponse?.content || [];
  const totalPages = currentResponse?.totalPages || 0;

  // 페이지 유효성 검사 (데이터가 로드된 후에만)
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  // 검색어가 변경될 때 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleModalOpen = (): void => {
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
  };

  const handleFAQSubmit = async (data: FAQUploadData): Promise<void> => {
    try {
      await createFAQMutation.mutateAsync(data);
      handleModalClose();
    } catch (error) {
      // 에러가 발생해도 모달은 열린 상태로 유지하여 사용자가 재시도할 수 있도록 함
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Container>
      <HeaderWrapper>
        <TitleContainer title="FAQ 관리" subtitle="자주 묻는 질문들을 관리하고 편집하세요" />
        <ButtonContainer>
          <StyledFAQButton 
            text="FAQ 추가" 
            width="var(--button-width)" 
            height="var(--button-height)"
            onClick={handleModalOpen}
          />
        </ButtonContainer>
      </HeaderWrapper>
      <FAQTable 
        faqItems={faqItems}
        isLoading={currentLoading}
        error={currentError}
        isSearchMode={isSearchMode}
        searchTerm={searchTerm}
        onSearch={handleSearch}
      />
      {totalPages > 1 && (
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
        isSubmitting={createFAQMutation.isPending}
      />
    </Container>
  );
};

export default FAQPage;

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
  margin-top: 4px;
  margin-bottom: 24px;
`;

