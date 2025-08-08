import { create } from 'zustand';
import type { DocumentItem } from "@/types/table";

interface DocumentStore {
  // 상태
  documentItems: DocumentItem[];
  searchTerm: string;
  selectedStatus: string;
  selectedCategory: string;
  archivedItems: number[];
  filteredData: DocumentItem[];

  // 액션
  setSearchTerm: (term: string) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedCategory: (category: string) => void;
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

// 초기 데이터 - API 응답 형식에 맞춤
const DOCUMENT_DATA: DocumentItem[] = [
  // 사내 정책 데이터
  {
    documentId: 1,
    documentName: "인사정책",
    category: "사내 정책",
    latestVersion: "v1.0.0",
    uploaderName: "김인사",
    fileUrl: "/api/policy/1",
    lastUpdatedAt: "2024-08-08 14:30",
    isActive: true
  },
  {
    documentId: 2,
    documentName: "복리후생정책",
    category: "사내 정책",
    latestVersion: "v1.0.0",
    uploaderName: "박복리",
    fileUrl: "/api/policy/2",
    lastUpdatedAt: "2024-08-08 15:20",
    isActive: true
  },
  {
    documentId: 3,
    documentName: "보안정책",
    category: "사내 정책",
    latestVersion: "v1.0.0",
    uploaderName: "이보안",
    fileUrl: "/api/policy/3",
    lastUpdatedAt: "2024-08-08 16:10",
    isActive: true
  },
  // 용어사전 데이터
  {
    documentId: 4,
    documentName: "API",
    category: "용어 사전",
    latestVersion: "v1.0.0",
    uploaderName: "김개발",
    fileUrl: "/api/glossary/1",
    lastUpdatedAt: "2024-08-08 14:30",
    isActive: true
  },
  {
    documentId: 5,
    documentName: "UI/UX",
    category: "용어 사전",
    latestVersion: "v1.0.0",
    uploaderName: "박디자인",
    fileUrl: "/api/glossary/2",
    lastUpdatedAt: "2024-08-08 15:20",
    isActive: true
  },
  {
    documentId: 6,
    documentName: "DevOps",
    category: "용어 사전",
    latestVersion: "v1.0.0",
    uploaderName: "이운영",
    fileUrl: "/api/glossary/3",
    lastUpdatedAt: "2024-08-08 16:10",
    isActive: true
  },
  // 보고서 양식 데이터
  {
    documentId: 7,
    documentName: "월간보고서",
    category: "보고서 양식",
    latestVersion: "v1.0.0",
    uploaderName: "김보고",
    fileUrl: "/api/reportform/1",
    lastUpdatedAt: "2024-08-08 14:30",
    isActive: true
  },
  {
    documentId: 8,
    documentName: "분기보고서",
    category: "보고서 양식",
    latestVersion: "v1.0.0",
    uploaderName: "박보고",
    fileUrl: "/api/reportform/2",
    lastUpdatedAt: "2024-08-08 15:20",
    isActive: true
  },
  {
    documentId: 9,
    documentName: "연간보고서",
    category: "보고서 양식",
    latestVersion: "v1.0.0",
    uploaderName: "이보고",
    fileUrl: "/api/reportform/3",
    lastUpdatedAt: "2024-08-08 16:10",
    isActive: true
  },
  // 비활성 데이터
  {
    documentId: 10,
    documentName: "구인사정책",
    category: "사내 정책",
    latestVersion: "v0.9.0",
    uploaderName: "김인사",
    fileUrl: "/api/policy/4",
    lastUpdatedAt: "2024-07-15 10:30",
    isActive: false
  },
  {
    documentId: 11,
    documentName: "데이터베이스",
    category: "용어 사전",
    latestVersion: "v0.8.0",
    uploaderName: "박개발",
    fileUrl: "/api/glossary/4",
    lastUpdatedAt: "2024-07-20 14:20",
    isActive: false
  },
  {
    documentId: 12,
    documentName: "주간보고서",
    category: "보고서 양식",
    latestVersion: "v0.7.0",
    uploaderName: "김보고",
    fileUrl: "/api/reportform/4",
    lastUpdatedAt: "2024-07-25 09:15",
    isActive: false
  }
];

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  // 초기 상태
  documentItems: DOCUMENT_DATA,
  searchTerm: '',
  selectedStatus: '전체 상태',
  selectedCategory: '전체 카테고리',
  archivedItems: [],
  filteredData: DOCUMENT_DATA,

  // 액션들
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
      selectedStatus: '',
      selectedCategory: '전체 카테고리'
    });
    get().updateFilteredData();
  },
  
  addDocumentItem: (item) => {
    const newItem: DocumentItem = {
      ...item,
      documentId: Math.max(...get().documentItems.map(item => item.documentId)) + 1
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
    } else {
      // 상태 필터가 없거나 "전체"이면 모든 문서 표시 (필터링하지 않음)
      // filtered는 이미 모든 문서를 포함하고 있으므로 추가 필터링 불필요
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
})); 