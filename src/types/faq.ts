export interface FAQCategory {
  categoryId: string;
  categoryName: string;
  categoryNameImage: string;
  description: string;
  faqCount: number;
  isActive: boolean;
}

export interface ConfirmModalState {
  isOpen: boolean;
  type: 'archive' | 'download' | 'restore' | null;
  categoryId: string | null;
  categoryName: string;
}

export interface FAQTableProps {
  currentPage: number;
  itemsPerPage: number;
}

export interface FAQConfirmModalState {
  isOpen: boolean;
  type: 'archive' | null;
  faqId: number | null;
  faqName: string;
}

export interface EditModalState {
  isOpen: boolean;
  faqData: {
    question: string;
    answer: string;
    category: string;
  } | undefined;
  faqId: number | null;
} 