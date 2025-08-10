import { create } from 'zustand';

interface DocumentPageUIState {
  // 페이지네이션 상태
  currentPage: number;
  
  // 필터 상태
  selectedCategory: string;
  
  // 모달 상태
  confirmModal: {
    isOpen: boolean;
    type: 'archive' | 'download';
    fileName: string;
  };
  
  versionModal: {
    isOpen: boolean;
    fileName: string;
  };
}

interface DocumentPageUIActions {
  // 페이지네이션 액션
  setCurrentPage: (page: number) => void;
  resetPage: () => void;
  
  // 필터 액션
  setSelectedCategory: (category: string) => void;
  
  // 모달 액션
  openConfirmModal: (type: 'archive' | 'download', fileName: string) => void;
  closeConfirmModal: () => void;
  
  openVersionModal: (fileName: string) => void;
  closeVersionModal: () => void;
  
  // 전체 리셋
  resetAll: () => void;
}

const initialState: DocumentPageUIState = {
  currentPage: 1,
  selectedCategory: '전체 카테고리',
  confirmModal: {
    isOpen: false,
    type: 'download',
    fileName: '',
  },
  versionModal: {
    isOpen: false,
    fileName: '',
  },
};

export const useDocumentPageStore = create<DocumentPageUIState & DocumentPageUIActions>((set) => ({
  ...initialState,
  
  // 페이지네이션 액션
  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
  
  resetPage: () => {
    set({ currentPage: 1 });
  },
  
  // 필터 액션
  setSelectedCategory: (category) => {
    set({ selectedCategory: category, currentPage: 1 });
  },
  
  // 모달 액션
  openConfirmModal: (type, fileName) => {
    set({
      confirmModal: {
        isOpen: true,
        type,
        fileName,
      },
    });
  },
  
  closeConfirmModal: () => {
    set({
      confirmModal: {
        isOpen: false,
        type: 'download',
        fileName: '',
      },
    });
  },
  
  openVersionModal: (fileName) => {
    set({
      versionModal: {
        isOpen: true,
        fileName,
      },
    });
  },
  
  closeVersionModal: () => {
    set({
      versionModal: {
        isOpen: false,
        fileName: '',
      },
    });
  },
  
  // 전체 리셋
  resetAll: () => {
    set(initialState);
  },
}));
