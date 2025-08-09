import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { FAQCategory } from '@/types/faq';

interface ConfirmModalState {
  isOpen: boolean;
  type: 'archive' | 'download' | 'restore' | null;
  faqId: number | null;
  faqName: string;
  categoryId: string | null;
  categoryName: string;
}

interface EditModalState {
  isOpen: boolean;
  faqData: {
    question: string;
    answer: string;
    category: string;
  } | undefined;
  faqId: number | null;
}

interface FAQState {
  // 검색 및 필터 상태
  selectedCategory: string;
  searchTerm: string;
  
  // FAQ 테이블 UI 상태
  expandedRows: Set<number>;
  confirmModal: ConfirmModalState;
  editModal: EditModalState;
  
  // 카테고리 UI 상태
  selectedCategoryItem: FAQCategory | null;
  categoryConfirmModal: {
    isOpen: boolean;
    type: 'archive' | 'restore' | null;
    categoryId: string | null;
    categoryName: string;
  };
  
  // Actions
  setSelectedCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  
  // FAQ 테이블 액션
  toggleExpandedRow: (faqId: number) => void;
  setConfirmModal: (modal: ConfirmModalState) => void;
  setEditModal: (modal: EditModalState) => void;
  closeConfirmModal: () => void;
  closeEditModal: () => void;
  
  // 카테고리 액션
  setSelectedCategoryItem: (category: FAQCategory | null) => void;
  setCategoryConfirmModal: (modal: { isOpen: boolean; type: 'archive' | 'restore' | null; categoryId: string | null; categoryName: string }) => void;
  closeCategoryConfirmModal: () => void;
}

// FAQ 스토어 - UI 상태만 관리
export const useFAQStore = create<FAQState>()(
  devtools(
    (set) => ({
      // 초기 상태
      selectedCategory: "",
      searchTerm: "",
      expandedRows: new Set<number>(),
      confirmModal: {
        isOpen: false,
        type: null,
        faqId: null,
        faqName: "",
        categoryId: null,
        categoryName: ""
      },
      editModal: {
        isOpen: false,
        faqData: undefined,
        faqId: null
      },
      selectedCategoryItem: null,
      categoryConfirmModal: {
        isOpen: false,
        type: null,
        categoryId: null,
        categoryName: ""
      },

      // 검색 및 필터 액션
      setSelectedCategory: (category: string) => {
        set({ selectedCategory: category });
      },

      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
      },

      // FAQ 테이블 액션
      toggleExpandedRow: (faqId: number) => {
        set((state) => {
          const newExpandedRows = new Set(state.expandedRows);
          if (newExpandedRows.has(faqId)) {
            newExpandedRows.delete(faqId);
          } else {
            newExpandedRows.add(faqId);
          }
          return { expandedRows: newExpandedRows };
        });
      },

      setConfirmModal: (modal: ConfirmModalState) => {
        set({ confirmModal: modal });
      },

      setEditModal: (modal: EditModalState) => {
        set({ editModal: modal });
      },

      closeConfirmModal: () => {
        set({
          confirmModal: {
            isOpen: false,
            type: null,
            faqId: null,
            faqName: "",
            categoryId: null,
            categoryName: ""
          }
        });
      },

      closeEditModal: () => {
        set({
          editModal: {
            isOpen: false,
            faqData: undefined,
            faqId: null
          }
        });
      },

      // 카테고리 액션
      setSelectedCategoryItem: (category: FAQCategory | null) => {
        set({ selectedCategoryItem: category });
      },

      setCategoryConfirmModal: (modal) => {
        set({ categoryConfirmModal: modal });
      },

      closeCategoryConfirmModal: () => {
        set({
          categoryConfirmModal: {
            isOpen: false,
            type: null,
            categoryId: null,
            categoryName: ""
          }
        });
      },
    }),
    {
      name: 'faq-store'
    }
  )
);

 