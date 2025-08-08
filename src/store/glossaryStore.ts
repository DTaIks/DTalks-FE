import { create } from 'zustand';

export interface GlossaryItem {
  documentId: number;
  documentName: string;
  category: string;
  latestVersion: string;
  uploaderName: string;
  fileUrl: string;
  lastUpdatedAt: string;
  isActive: boolean;
  isArchived: boolean;
}

interface GlossaryStore {
  // 상태
  glossaryItems: GlossaryItem[];
  searchTerm: string;
  selectedStatus: string;
  archivedItems: number[];

  // 액션
  setSearchTerm: (term: string) => void;
  setSelectedStatus: (status: string) => void;
  addGlossaryItem: (item: Omit<GlossaryItem, 'documentId' | 'isArchived'>) => void;
  updateGlossaryItem: (id: number, updates: Partial<GlossaryItem>) => void;
  archiveGlossaryItem: (id: number) => void;
  unarchiveGlossaryItem: (id: number) => void;
  deleteGlossaryItem: (id: number) => void;
  
  // 계산된 값
  filteredData: GlossaryItem[];
  formatStatsForDisplay: () => {
    total: number;
    active: number;
    archived: number;
    categories: { name: string; count: number }[];
  };
  getFilteredData: (currentPage: number, itemsPerPage: number) => {
    paginatedData: GlossaryItem[];
    totalItems: number;
    totalPages: number;
  };
}

// 초기 데이터
const initialGlossaryItems: GlossaryItem[] = [
  {
    documentId: 1,
    documentName: "API",
    category: "용어사전",
    latestVersion: "v1.0.0",
    uploaderName: "김개발",
    fileUrl: "/api/glossary/1",
    lastUpdatedAt: "2024-08-08 14:30",
    isActive: true,
    isArchived: false
  },
  {
    documentId: 2,
    documentName: "UI/UX",
    category: "용어 사전",
    latestVersion: "v1.0.0",
    uploaderName: "박디자인",
    fileUrl: "/api/glossary/2",
    lastUpdatedAt: "2024-08-08 15:20",
    isActive: true,
    isArchived: false
  },
  {
    documentId: 3,
    documentName: "DevOps",
    category: "용어 사전",
    latestVersion: "v1.0.0",
    uploaderName: "이운영",
    fileUrl: "/api/glossary/3",
    lastUpdatedAt: "2024-08-08 16:10",
    isActive: true,
    isArchived: false
  },
  {
    documentId: 4,
    documentName: "Agile",
    category: "용어 사전",
    latestVersion: "v1.0.0",
    uploaderName: "최프로젝트",
    fileUrl: "/api/glossary/4",
    lastUpdatedAt: "2024-08-08 17:00",
    isActive: true,
    isArchived: false
  },
  {
    documentId: 5,
    documentName: "Cloud Computing",
    category: "용어 사전",
    latestVersion: "v1.0.0",
    uploaderName: "정클라우드",
    fileUrl: "/api/glossary/5",
    lastUpdatedAt: "2024-08-08 18:30",
    isActive: false,
    isArchived: false
  },
  {
    documentId: 6,
    documentName: "Machine Learning",
    category: "용어 사전",
    latestVersion: "v1.0.0",
    uploaderName: "김AI",
    fileUrl: "/api/glossary/6",
    lastUpdatedAt: "2024-08-08 19:15",
    isActive: true,
    isArchived: false
  }
];

export const useGlossaryStore = create<GlossaryStore>((set, get) => ({
  // 초기 상태
  glossaryItems: initialGlossaryItems,
  searchTerm: '',
  selectedStatus: '',
  archivedItems: [],

  // 액션들
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  
  setSelectedStatus: (status: string) => set({ selectedStatus: status }),
  
  addGlossaryItem: (item) => {
    const newItem: GlossaryItem = {
      ...item,
      documentId: Math.max(...get().glossaryItems.map(item => item.documentId)) + 1,
      isArchived: false
    };
    set(state => ({
      glossaryItems: [...state.glossaryItems, newItem]
    }));
  },
  
  updateGlossaryItem: (id, updates) => {
    set(state => ({
      glossaryItems: state.glossaryItems.map(item =>
        item.documentId === id ? { ...item, ...updates } : item
      )
    }));
  },
  
  archiveGlossaryItem: (id) => {
    set(state => ({
      archivedItems: [...state.archivedItems, id],
      glossaryItems: state.glossaryItems.map(item =>
        item.documentId === id ? { ...item, isArchived: true } : item
      )
    }));
  },
  
  unarchiveGlossaryItem: (id) => {
    set(state => ({
      archivedItems: state.archivedItems.filter(itemId => itemId !== id),
      glossaryItems: state.glossaryItems.map(item =>
        item.documentId === id ? { ...item, isArchived: false } : item
      )
    }));
  },
  
  deleteGlossaryItem: (id) => {
    set(state => ({
      glossaryItems: state.glossaryItems.filter(item => item.documentId !== id),
      archivedItems: state.archivedItems.filter(itemId => itemId !== id)
    }));
  },

  // 계산된 값들
  get filteredData() {
    const { glossaryItems, searchTerm, selectedStatus } = get();
    
    let filtered = glossaryItems.filter(item => !item.isArchived);
    
    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.documentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 상태 필터링
    if (selectedStatus && selectedStatus !== '') {
      filtered = filtered.filter(item => {
        if (selectedStatus === 'active') return item.isActive;
        if (selectedStatus === 'inactive') return !item.isActive;
        return true;
      });
    }
    
    return filtered;
  },

  formatStatsForDisplay: () => {
    const { glossaryItems } = get();
    const activeItems = glossaryItems.filter(item => !item.isArchived);
    const archivedItems = glossaryItems.filter(item => item.isArchived);
    
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
      total: activeItems.length,
      active: activeItems.filter(item => item.isActive).length,
      archived: archivedItems.length,
      categories
    };
  },

  getFilteredData: (currentPage, itemsPerPage) => {
    const filteredData = get().filteredData;
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
}));
