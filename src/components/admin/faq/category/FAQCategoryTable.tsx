import React, { useCallback } from "react";
import styled from "styled-components";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useFAQCategory } from "@/hooks/faq/useFAQCategory";
import type { FAQCategory } from "@/types/faq";
import FAQCategoryTableHeader from "@/components/admin/faq/category/FAQCategoryTableHeader";
import FAQCategoryTableHead from "@/components/admin/faq/category/FAQCategoryTableHead";
import FAQCategoryTableRow from "@/components/admin/faq/category/FAQCategoryTableRow";

const FAQCategoryTable: React.FC = () => {
  const {
    selectedCategory,
    categoryData,
    confirmModal,
    handleRowClick,
    handleArchiveClick,
    handleConfirmAction,
    handleCloseConfirmModal
  } = useFAQCategory();

  const renderTableRow = useCallback((category: FAQCategory) => (
    <FAQCategoryTableRow
      key={category.categoryId}
      category={category}
      isSelected={selectedCategory?.categoryId === category.categoryId}
      onRowClick={handleRowClick}
      onArchiveClick={handleArchiveClick}
    />
  ), [selectedCategory, handleRowClick, handleArchiveClick]);

  return (
    <>
      <TableContainer>
        <FAQCategoryTableHeader />
        <Table>
          <FAQCategoryTableHead />
          <TableBody>
            {categoryData.map(renderTableRow)}
          </TableBody>
        </Table>
      </TableContainer>

      {confirmModal.isOpen && confirmModal.type && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmAction}
          fileName={confirmModal.categoryName}
          type={confirmModal.type as 'archive' | 'download' | 'restore'}
        />
      )}
    </>
  );
};

export default FAQCategoryTable;

const TableContainer = styled.div`
  width: 1062px;
  height: 586px;
  border-radius: var(--br-18);
  background: var(--color-white);
  box-shadow: 0 6px 18px 0 rgba(125, 93, 246, 0.10);
  overflow: hidden;
`;

const Table = styled.div`
  width: 100%;
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 56px;
  padding-top: 28px;
`;