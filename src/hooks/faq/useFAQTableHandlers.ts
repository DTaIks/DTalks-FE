import { useState, useCallback } from "react";
import { useFAQStore } from "@/store/faqStore";
import { type FAQItem } from "@/types/faq";
import type { FAQUploadData } from "@/components/admin/faq/FAQUploadModal";
import type { FAQConfirmModalState, EditModalState } from "@/types/faq";

export const useFAQTableHandlers = () => {
  const {
    setSelectedCategory,
    setSearchTerm
  } = useFAQStore();

  // 로컬 상태 관리
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [confirmModal, setConfirmModal] = useState<FAQConfirmModalState>({
    isOpen: false,
    type: null,
    faqId: null,
    faqName: ''
  });
  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    faqData: undefined,
    faqId: null
  });

  // 행 토글 핸들러
  const handleRowToggle = useCallback((faqId: number) => {
    setExpandedRows(prev => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(faqId)) {
        newExpandedRows.delete(faqId);
      } else {
        newExpandedRows.add(faqId);
      }
      return newExpandedRows;
    });
  }, []);

  // 수정 핸들러
  const handleEdit = useCallback((faq: FAQItem) => {
    setEditModal({
      isOpen: true,
      faqData: {
        question: faq.question,
        answer: faq.answer || '',
        category: faq.category
      },
      faqId: faq.faqId
    });
  }, []);

  // 보관 클릭 핸들러
  const handleArchiveClick = useCallback((faq: FAQItem) => {
    setConfirmModal({
      isOpen: true,
      type: 'archive',
      faqId: faq.faqId,
      faqName: faq.question
    });
  }, []);

  // 확인 액션 핸들러
  const handleConfirmAction = useCallback(() => {
    if (confirmModal.type === 'archive' && confirmModal.faqId) {
      // TODO: API를 통한 FAQ 보관 처리 구현 필요
      console.log('FAQ 보관:', confirmModal.faqId);
    }
    setConfirmModal({
      isOpen: false,
      type: null,
      faqId: null,
      faqName: ''
    });
  }, [confirmModal]);

  // 모달 닫기 핸들러들
  const handleCloseConfirmModal = useCallback(() => {
    setConfirmModal({
      isOpen: false,
      type: null,
      faqId: null,
      faqName: ''
    });
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditModal({
      isOpen: false,
      faqData: undefined,
      faqId: null
    });
  }, []);

  // 수정 제출 핸들러
  const handleSubmitEdit = useCallback((data: FAQUploadData) => {
    if (editModal.faqId) {
      // TODO: API를 통한 FAQ 수정 처리 구현 필요
      console.log('FAQ 수정:', editModal.faqId, data);
    }
    handleCloseEditModal();
  }, [handleCloseEditModal, editModal.faqId]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, [setSelectedCategory]);

  // 검색 핸들러
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  return {
    // 상태
    expandedRows,
    confirmModal,
    editModal,
    
    // 핸들러
    handleRowToggle,
    handleEdit,
    handleArchiveClick,
    handleConfirmAction,
    handleCloseConfirmModal,
    handleCloseEditModal,
    handleSubmitEdit,
    handleCategoryChange,
    handleSearch
  };
}; 