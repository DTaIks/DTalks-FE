import { useCallback } from "react";

interface UsePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const usePagination = ({ currentPage, totalPages, onPageChange }: UsePaginationProps) => {
  const handlePrevClick = useCallback((): void => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextClick = useCallback((): void => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const handlePageClick = useCallback((page: number): void => {
    onPageChange(page);
  }, [onPageChange]);

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return {
    handlePrevClick,
    handleNextClick,
    handlePageClick,
    isPrevDisabled,
    isNextDisabled
  };
}; 