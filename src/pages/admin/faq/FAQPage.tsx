import { useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import FAQTable from "@/components/admin/faq/table/FAQTable";
import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import FAQUploadModal, { type FAQUploadData } from "@/components/admin/faq/FAQUploadModal";
import { useFAQList, useFAQSearch, useFAQFilter } from "@/query/useFAQQueries";
import { useCreateFAQ, useUpdateFAQ, useArchiveFAQ } from "@/query/useFAQMutations";
import { useFAQStore } from "@/store/faqStore";
import { getCategoryNameFromFilter } from "@/utils/faqUtils";
import { faqAPI } from "@/api/faqAPI";

const FAQPage = () => {
  useScrollToTop();
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>("");

  const { 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory,
    editModal,
    setEditModal,
    closeEditModal
  } = useFAQStore();
  
  const createFAQMutation = useCreateFAQ();
  const updateFAQMutation = useUpdateFAQ();
  const archiveFAQMutation = useArchiveFAQ();
  
  const dataMode = useMemo(() => {
    const hasSearchTerm = searchTerm.trim().length > 0;
    const hasSelectedCategory = selectedCategory.trim().length > 0;
    
    if (hasSelectedCategory && !hasSearchTerm) return 'filter';
    if (hasSearchTerm && !hasSelectedCategory) return 'search';
    return 'list';
  }, [searchTerm, selectedCategory]);

  const { data: faqListResponse, isLoading: isListLoading, error: listError } = useFAQList(currentPage);
  
  const { data: faqSearchResponse, isLoading: isSearchLoading, error: searchError, isDebouncing } = useFAQSearch(
    searchTerm,
    currentPage,
    dataMode === 'search'
  );
  
  const { data: faqFilterResponse, isLoading: isFilterLoading, error: filterError } = useFAQFilter(
    getCategoryNameFromFilter(selectedCategory),
    currentPage,
    dataMode === 'filter'
  );
  
  const { currentResponse, currentLoading, currentError } = useMemo(() => {
    switch (dataMode) {
      case 'filter':
        return {
          currentResponse: faqFilterResponse,
          currentLoading: isFilterLoading,
          currentError: filterError
        };
      case 'search':
        return {
          currentResponse: faqSearchResponse,
          currentLoading: isSearchLoading || isDebouncing,
          currentError: searchError
        };
      default:
        return {
          currentResponse: faqListResponse,
          currentLoading: isListLoading,
          currentError: listError
        };
    }
  }, [dataMode, faqFilterResponse, isFilterLoading, filterError, faqSearchResponse, isSearchLoading, isDebouncing, searchError, faqListResponse, isListLoading, listError]);
  
  const { faqItems, totalPages } = useMemo(() => {
    const items = currentResponse?.content || [];
    const pages = currentResponse?.totalPages || 0;
    return { faqItems: items, totalPages: pages };
  }, [currentResponse]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(page);
  }, []);

  const handleModalOpen = useCallback((): void => {
    setIsModalOpen(true);
    setModalError(""); // 모달 열 때 에러 메시지 초기화
  }, []);

  const handleModalClose = useCallback((): void => {
    setIsModalOpen(false);
    setModalError(""); // 모달 닫을 때 에러 메시지 초기화
  }, []);

  const handleFAQSubmit = useCallback(async (data: FAQUploadData): Promise<void> => {
    try {
      setModalError(""); // 제출 시 에러 메시지 초기화
      await createFAQMutation.mutateAsync(data);
      handleModalClose();
    } catch (error) {
      console.error('FAQ 생성 실패:', error);
      
      // 에러 메시지 처리
      const errorMessage = error instanceof Error ? error.message : 'FAQ 추가에 실패했습니다.';
      
      // 중복 에러인지 확인
      if (errorMessage.includes('중복') || errorMessage.includes('이미 존재')) {
        setModalError('동일한 질문이 이미 존재합니다. 다른 질문을 입력해주세요.');
      } else if (errorMessage.includes('카테고리')) {
        setModalError('카테고리 정보가 올바르지 않습니다. 다시 선택해주세요.');
      } else {
        setModalError(errorMessage);
      }
    }
  }, [createFAQMutation, handleModalClose]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (selectedCategory) {
      setSelectedCategory("");
    }
  }, [selectedCategory, setSearchTerm, setSelectedCategory]);

  const handleCategoryChange = useCallback((categoryValue: string) => {
    setSelectedCategory(categoryValue);
    if (searchTerm) {
      setSearchTerm("");
    }
  }, [searchTerm, setSelectedCategory, setSearchTerm]);

  // FAQ 상세 정보 조회 핸들러 - 수정 모달을 여는 역할
  const handleFAQDetail = useCallback(async (faqId: number) => {
    try {
      // FAQ 상세 정보 조회
      const faqDetail = await faqAPI.getFAQDetail(faqId);
      
      if (faqDetail) {
        // 수정 모달 열기
        setEditModal({
          isOpen: true,
          faqData: {
            question: faqDetail.question,
            answer: faqDetail.answer,
            category: faqDetail.categoryName // categoryName 필드 사용
          },
          faqId: faqId
        });
      }
    } catch (error) {
      console.error('FAQ 상세 정보 조회 실패:', error);
    }
  }, [setEditModal]);

  // FAQ 수정 핸들러
  const handleFAQUpdate = useCallback(async (faqId: number, faqData: { question: string; answer: string; category: string }) => {
    try {
      await updateFAQMutation.mutateAsync({
        faqId,
        faqData
      });
      closeEditModal(); // 수정 완료 후 모달 닫기
    } catch (error) {
      console.error('FAQ 수정 실패:', error);
    }
  }, [updateFAQMutation, closeEditModal]);

  // FAQ 보관 핸들러
  const handleFAQArchive = useCallback(async (faqId: number) => {
    try {
      await archiveFAQMutation.mutateAsync(faqId);
    } catch (error) {
      console.error('FAQ 보관 실패:', error);
    }
  }, [archiveFAQMutation]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

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
        isSearchMode={dataMode !== 'list'}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onFAQDetail={handleFAQDetail}
        onFAQArchive={handleFAQArchive}
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
        errorMessage={modalError}
      />

      {/* 수정 모달 */}
      <FAQUploadModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        onSubmit={(data) => handleFAQUpdate(editModal.faqId!, data)}
        isSubmitting={updateFAQMutation.isPending}
        isEdit={true}
        initialData={editModal.faqData}
        errorMessage={modalError}
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
