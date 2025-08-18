import { create } from 'zustand';

interface DocumentStore {
  // UI 상태만 관리
  searchTerm: string;
  selectedStatus: string;
  selectedCategory: string;

  // 액션
  setSearchTerm: (term: string) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedCategory: (category: string) => void;
  resetFilters: () => void;
  resetAll: () => void;
}

export const useDocumentStore = create<DocumentStore>()(
  (set) => ({
    // 초기 상태
    searchTerm: '',
    selectedStatus: '전체 상태',
    selectedCategory: '전체 카테고리',

    // 액션들
    setSearchTerm: (term: string) => {
      set({ searchTerm: term });
    },
    
    setSelectedStatus: (status: string) => {
      set({ selectedStatus: status });
    },

    setSelectedCategory: (category: string) => {
      set({ selectedCategory: category });
    },

    resetFilters: () => {
      set({ 
        searchTerm: '',
        selectedStatus: '전체 상태',
        selectedCategory: '전체 카테고리'
      });
    },

    resetAll: () => {
      set({ 
        searchTerm: '',
        selectedStatus: '전체 상태',
        selectedCategory: '전체 카테고리'
      });
    }
  })
); 