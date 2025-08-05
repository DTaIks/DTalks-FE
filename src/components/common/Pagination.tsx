import React from "react";
import styled from "styled-components";
import { usePagination } from "@/hooks/usePagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const {
    handlePrevClick,
    handleNextClick,
    handlePageClick,
    isPrevDisabled,
    isNextDisabled
  } = usePagination({ currentPage, totalPages, onPageChange });

  return (
    <PaginationContainer>
      <PrevButtonContainer onClick={handlePrevClick} disabled={isPrevDisabled}>
        <PrevButtonBackground />
        <InactivePageNumber>
          이전
        </InactivePageNumber>
      </PrevButtonContainer>
      
      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        const isActive = pageNumber === currentPage;
        
        return (
          <PageContainer 
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
            isActive={isActive}
          >
            {isActive ? (
              <>
                <ActivePageBackground />
                <ActivePageNumber>{pageNumber}</ActivePageNumber>
              </>
            ) : (
              <>
                <InactivePageBackground />
                <InactivePageNumber>{pageNumber}</InactivePageNumber>
              </>
            )}
          </PageContainer>
        );
      })}
      
      <NextButtonContainer onClick={handleNextClick} disabled={isNextDisabled}>
        <NextButtonBackground />
        <InactivePageNumber>
          다음
        </InactivePageNumber>
      </NextButtonContainer>
    </PaginationContainer>
  );
};

export default Pagination;

const ActivePageBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
  background-color: var(--color-mediumpurple-200);
  width: 28px;
  height: 28px;
`;

const ActivePageNumber = styled.div`
  z-index: 1;
  position: absolute;
  padding: 5px;
  color: var(--color-white);
`;

const InactivePageBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.35);
  border: 0.375px solid #CCC;
  box-sizing: border-box;
  width: 28px;
  height: 28px;
`;

const InactivePageNumber = styled.div`
  z-index: 1;
  position: absolute;
  padding: 5px;
  color: var(--color-silver);
`;

interface PageContainerProps {
  isActive?: boolean;
}

const PageContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isActive'
})<PageContainerProps>`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 4px;
  cursor: pointer;
  
  &:last-of-type {
    margin-right: 0;
  }
`;

const NextButtonBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
  background: #FFF;
  border: 0.4px solid #CCC;
  box-sizing: border-box;
  width: 44px;
  height: 28px;
`;

const NextButtonContainer = styled.div<{ disabled?: boolean }>`
  width: 44px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-left: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const PrevButtonBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.35);
  border: 0.4px solid #CCC;
  box-sizing: border-box;
  width: 44px;
  height: 28px;
`;

const PrevButtonContainer = styled.div<{ disabled?: boolean }>`
  width: 44px;
  height: 28px;
  color: var(--color-silver);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 28px;
  font-size: 14px;
  margin-top: 24px;
  position: relative;
`; 