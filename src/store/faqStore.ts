import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FAQState {
  // UI 상태만 관리 (실제 데이터는 API에서 관리)
  selectedCategory: string;
  searchTerm: string;
  
  setSelectedCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
}

// FAQ 스토어 - UI 상태만 관리
export const useFAQStore = create<FAQState>()(
  devtools(
    (set) => ({
      selectedCategory: "",
      searchTerm: "",

      setSelectedCategory: (category: string) => {
        set({ selectedCategory: category });
      },

      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
      },
    }),
    {
      name: 'faq-store'
    }
  )
);

 