import React from "react";
import styled from "styled-components";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevClick = (): void => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = (): void => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number): void => {
    onPageChange(page);
  };

  return (
    <PaginationContainer>
      <PrevButtonContainer onClick={handlePrevClick} disabled={currentPage === 1}>
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
      
      <NextButtonContainer onClick={handleNextClick} disabled={currentPage === totalPages}>
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
  border-radius: 3.75px;
  background-color: var(--color-mediumpurple-200);
  width: 1.78rem;
  height: 1.78rem;
`;

const ActivePageNumber = styled.div`
  z-index: 1;
  position: absolute;
  top: 0.422rem;
  left: 0.704rem;
  color: var(--color-white);
`;

const InactivePageBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3.75px;
  background: rgba(255, 255, 255, 0.35);
  border: 0.375px solid #CCC;
  box-sizing: border-box;
  width: 1.78rem;
  height: 1.78rem;
`;

const InactivePageNumber = styled.div`
  z-index: 1;
  position: absolute;
  top: 0.422rem;
  left: 0.656rem;
  color: var(--color-silver);
`;

interface PageContainerProps {
  isActive?: boolean;
}

const PageContainer = styled.div<PageContainerProps>`
  width: 1.78rem;
  height: 1.78rem;
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
  border-radius: 3.75px;
  background: #FFF;
  border: 0.375px solid #CCC;
  box-sizing: border-box;
  width: 2.81rem;
  height: 1.78rem;
`;

const NextButtonContainer = styled.div<{ disabled?: boolean }>`
  width: 2.81rem;
  height: 1.78rem;
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
  border-radius: 3.75px;
  background: rgba(255, 255, 255, 0.35);
  border: 0.375px solid #CCC;
  box-sizing: border-box;
  width: 2.81rem;
  height: 1.78rem;
`;

const PrevButtonContainer = styled.div<{ disabled?: boolean }>`
  width: 2.81rem;
  height: 1.78rem;
  color: var(--color-silver);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 1.78rem;
  font-size: 0.844rem;
  margin-top: 24px;
  position: relative;
`; 