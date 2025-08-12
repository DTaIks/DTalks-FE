import { create } from 'zustand';
import type { DocumentItem } from "@/types/table";

interface DocumentStore {
  // 상태
  documentItems: DocumentItem[];
  searchTerm: string;
  selectedStatus: string;
  selectedCategory: string;
  filteredData: DocumentItem[];
  isLoading: boolean;
  error: string | null;

  // 액션
  setDocumentItems: (items: DocumentItem[]) => void;
  setSearchTerm: (term: string) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedCategory: (category: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetFilters: () => void;
  addDocumentItem: (item: Omit<DocumentItem, 'documentId'>) => void;
  updateDocumentItem: (documentId: number, updates: Partial<DocumentItem>) => void;
  archiveDocumentItem: (documentId: number) => void;
  deleteDocumentItem: (documentId: number) => void;
  updateFilteredData: () => void;
  
  // 계산된 값
  getStats: () => {
    total: number;
    active: number;
    inactive: number;
    categories: { name: string; count: number }[];
  };
  getFormattedStats: () => Array<{
    title: string;
    value: string;
    additionalInfo: string;
  }>;
  getFilteredData: (currentPage: number, itemsPerPage: number) => {
    paginatedData: DocumentItem[];
    totalItems: number;
    totalPages: number;
  };
}

export const useDocumentStore = create<DocumentStore>()(
  (set, get) => ({
    // 초기 상태
    documentItems: [],
    searchTerm: '',
    selectedStatus: '전체 상태',
    selectedCategory: '전체 카테고리',
    filteredData: [],
    isLoading: false,
    error: null,

    // 액션들
    setDocumentItems: (items: DocumentItem[]) => {
      set({ documentItems: items });
      get().updateFilteredData();
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error });
    },

    setSearchTerm: (term: string) => {
      set({ searchTerm: term });
      get().updateFilteredData();
    },
    
    setSelectedStatus: (status: string) => {
      set({ selectedStatus: status });
      get().updateFilteredData();
    },

    setSelectedCategory: (category: string) => {
      set({ selectedCategory: category });
      get().updateFilteredData();
    },

    resetFilters: () => {
      set({ 
        searchTerm: '',
        selectedStatus: '전체 상태',
        selectedCategory: '전체 카테고리'
      });
      get().updateFilteredData();
    },
    
    addDocumentItem: (item) => {
      const newItem: DocumentItem = {
        ...item,
        documentId: Math.max(...get().documentItems.map(item => item.documentId), 0) + 1
      };
      set(state => ({
        documentItems: [...state.documentItems, newItem]
      }));
      get().updateFilteredData();
    },
    
    updateDocumentItem: (documentId, updates) => {
      set(state => ({
        documentItems: state.documentItems.map(item =>
          item.documentId === documentId ? { ...item, ...updates } : item
        )
      }));
      get().updateFilteredData();
    },
    
    archiveDocumentItem: (documentId) => {
      set(state => ({
        documentItems: state.documentItems.map(item =>
          item.documentId === documentId ? { ...item, isActive: false } : item
        )
      }));
      get().updateFilteredData();
    },
    
    deleteDocumentItem: (documentId) => {
      set(state => ({
        documentItems: state.documentItems.filter(item => item.documentId !== documentId)
      }));
      get().updateFilteredData();
    },

    updateFilteredData: () => {
      const { documentItems, searchTerm, selectedStatus, selectedCategory } = get();
      
      let filtered = documentItems;
      
      // 카테고리 필터링
      if (selectedCategory && selectedCategory !== '전체 카테고리') {
        filtered = filtered.filter(item => item.category === selectedCategory);
      }
      
      // 검색어 필터링
      if (searchTerm) {
        filtered = filtered.filter(item =>
          item.documentName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // 상태 필터링
      if (selectedStatus && selectedStatus !== "전체 상태") {
        filtered = filtered.filter(item => {
          if (selectedStatus === "활성") return item.isActive;
          if (selectedStatus === "비활성") return !item.isActive;
          return true;
        });
      }
      
      set({ filteredData: filtered });
    },

    getStats: () => {
      const { documentItems } = get();
      const activeItems = documentItems.filter(item => item.isActive);
      const inactiveItems = documentItems.filter(item => !item.isActive);
      
      const categories = activeItems.reduce((acc, item) => {
        const existing = acc.find(cat => cat.name === item.category);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ name: item.category, count: 1 });
        }
        return acc;
      }, [] as { name: string; count: number }[]);
      
      return {
        total: documentItems.length,
        active: activeItems.length,
        inactive: inactiveItems.length,
        categories
      };
    },

    getFormattedStats: () => {
      const statsData = get().getStats();
      return [
        {
          title: "총 문서 수",
          value: `${statsData.total}개`,
          additionalInfo: "+2개 이번 주"
        },
        {
          title: "활성 문서 수",
          value: `${statsData.active}개`,
          additionalInfo: "+1개 이번 주"
        },
        {
          title: "비활성 문서 수",
          value: `${statsData.inactive}개`,
          additionalInfo: "+1개 이번 달"
        }
      ];
    },

    getFilteredData: (currentPage, itemsPerPage) => {
      const { filteredData } = get();
      const totalItems = filteredData.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      return {
        paginatedData,
        totalItems,
        totalPages
      };
    }
  })
); 