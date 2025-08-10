import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import FAQTable from "@/components/admin/faq/table/FAQTable";
import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import FAQUploadModal, { type FAQUploadData } from "@/components/admin/faq/FAQUploadModal";
import { useFAQList, useFAQSearch, useFAQFilter } from "@/query/useFAQQueries";
import { useCreateFAQ } from "@/query/useFAQMutations";
import { useFAQStore } from "@/store/faqStore";
import { getCategoryNameFromFilter } from "@/utils/faqUtils";

// FAQ 관리 페이지
const FAQPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 검색 상태 및 카테고리 상태 확인
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useFAQStore();
  
  // FAQ 추가 뮤테이션
  const createFAQMutation = useCreateFAQ();
  
  // 데이터 조회 모드 결정
  const isSearchMode = searchTerm.trim().length > 0;
  const isFilterMode = selectedCategory.trim().length > 0;
  
  // 일반 목록 조회
  const { data: faqListResponse, isLoading: isListLoading, error: listError } = useFAQList(currentPage);
  
  // 검색 조회
  const { data: faqSearchResponse, isLoading: isSearchLoading, error: searchError, isDebouncing } = useFAQSearch(
    searchTerm,
    currentPage,
    isSearchMode && !isFilterMode
  );
  
  // 카테고리 필터링 조회 (필터 값을 실제 카테고리명으로 변환)
  const { data: faqFilterResponse, isLoading: isFilterLoading, error: filterError } = useFAQFilter(
    getCategoryNameFromFilter(selectedCategory),
    currentPage,
    isFilterMode && !isSearchMode
  );
  
  // 현재 모드에 따른 데이터 선택 (useMemo로 최적화)
  const currentResponse = useMemo(() => {
    if (isFilterMode && !isSearchMode) return faqFilterResponse;
    if (isSearchMode && !isFilterMode) return faqSearchResponse;
    return faqListResponse;
  }, [isFilterMode, isSearchMode, faqFilterResponse, faqSearchResponse, faqListResponse]);
  
  const currentLoading = useMemo(() => {
    if (isFilterMode && !isSearchMode) return isFilterLoading;
    if (isSearchMode && !isFilterMode) return isSearchLoading || isDebouncing;
    return isListLoading;
  }, [isFilterMode, isSearchMode, isFilterLoading, isSearchLoading, isDebouncing, isListLoading]);
  
  const currentError = useMemo(() => {
    if (isFilterMode && !isSearchMode) return filterError;
    if (isSearchMode && !isFilterMode) return searchError;
    return listError;
  }, [isFilterMode, isSearchMode, filterError, searchError, listError]);
  
  // API 응답에서 필요한 데이터 추출 (useMemo로 최적화)
  const { faqItems, totalPages } = useMemo(() => {
    const items = currentResponse?.content || [];
    const pages = currentResponse?.totalPages || 0;
    return { faqItems: items, totalPages: pages };
  }, [currentResponse]);

  // 페이지 유효성 검사 (데이터가 로드된 후에만)
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  // 검색어나 카테고리가 변경될 때 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

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
      console.error('FAQ 생성 실패:', error);
      // 에러가 발생해도 모달은 열린 상태로 유지하여 사용자가 재시도할 수 있도록 함
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // 검색 시 카테고리 필터 초기화
    if (selectedCategory) {
      setSelectedCategory("");
    }
  };

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    // 카테고리 선택 시 검색어 초기화
    if (searchTerm) {
      setSearchTerm("");
    }
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
        isSearchMode={isSearchMode || isFilterMode}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
      />
      {(faqItems.length > 0 || totalPages > 0) && (
        <PaginationContainer>
          <Pagination
            key={totalPages}
            currentPage={currentPage}
            totalPages={Math.max(totalPages, 1)}
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
