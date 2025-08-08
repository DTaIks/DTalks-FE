import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import DocumentCategory1 from "@/assets/document/DocumentCategory1.svg";
import DocumentCategory2 from "@/assets/document/DocumentCategory2.svg";
import DocumentCategory3 from "@/assets/document/DocumentCategory3.svg";
import ActiveIcon from "@/assets/common/Active.svg";
import InActiveIcon from "@/assets/common/InActive.svg";

interface DocumentItem {
  id: number;
  name: string;
  category: string;
  categoryImage: string;
  version: string;
  author: string;
  lastModified: string;
  status: string;
  statusIcon: string;
}

interface DocumentStats {
  totalDocuments: number;
  activeDocuments: number;
  inactiveDocuments: number;
}

interface DocumentState {
  documentItems: DocumentItem[];
  selectedCategory: string;
  selectedStatus: string;
  searchTerm: string;
  filteredData: DocumentItem[];
  
  setSelectedCategory: (category: string) => void;
  setSelectedStatus: (status: string) => void;
  setSearchTerm: (term: string) => void;
  updateDocumentItem: (id: number, updatedData: Partial<DocumentItem>) => void;
  archiveDocumentItem: (id: number) => void;
  updateFilteredData: () => void;
  
  getFilteredData: (currentPage: number, itemsPerPage: number) => {
    paginatedData: DocumentItem[];
    totalItems: number;
  };
  
  getDocumentStats: () => DocumentStats;
  formatStatsForDisplay: () => Array<{
    title: string;
    value: string;
    additionalInfo: string;
  }>;
}

const DOCUMENT_DATA: DocumentItem[] = [
  {
    id: 1,
    name: "개발팀 업무 매뉴얼",
    category: "보고서양식",
    categoryImage: DocumentCategory1,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
  {
    id: 2,
    name: "개발팀 업무 매뉴얼",
    category: "사내 정책",
    categoryImage: DocumentCategory2,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
  {
    id: 3,
    name: "개발팀 업무 매뉴얼",
    category: "보고서양식",
    categoryImage: DocumentCategory3,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
  {
    id: 4,
    name: "개발팀 업무 매뉴얼",
    category: "보고서양식",
    categoryImage: DocumentCategory3,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
  {
    id: 5,
    name: "개발팀 업무 매뉴얼",
    category: "사내 정책",
    categoryImage: DocumentCategory3,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
  {
    id: 6,
    name: "용어 사전",
    category: "용어 사전",
    categoryImage: DocumentCategory1,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "비활성",
    statusIcon: InActiveIcon
  },
];

// 문서 스토어
export const useDocumentStore = create<DocumentState>()(
  devtools(
    (set, get) => ({
      documentItems: DOCUMENT_DATA,
      selectedCategory: "",
      selectedStatus: "",
      searchTerm: "",
      filteredData: DOCUMENT_DATA,

      setSelectedCategory: (category: string) => {
        set({ selectedCategory: category });
        get().updateFilteredData();
      },

      setSelectedStatus: (status: string) => {
        set({ selectedStatus: status });
        get().updateFilteredData();
      },

      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
        get().updateFilteredData();
      },

      updateFilteredData: () => {
        const { documentItems, selectedCategory, searchTerm, selectedStatus } = get();
        let filteredData = documentItems;

        if (searchTerm) {
          filteredData = filteredData.filter(doc => 
            doc.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (selectedCategory) {
          filteredData = filteredData.filter(doc => {
            switch (selectedCategory) {
              case "report":
                return doc.category === "보고서 양식";
              case "dictionary":
                return doc.category === "용어 사전";
              case "policy":
                return doc.category === "사내 정책";
              default:
                return true;
            }
          });
        }

        if (selectedStatus) {
          filteredData = filteredData.filter(doc => {
            if (selectedStatus === "활성") return doc.status === "활성";
            if (selectedStatus === "비활성") return doc.status === "비활성";
            return true;
          });
        }

        set({ filteredData });
      },

      updateDocumentItem: (id: number, updatedData: Partial<DocumentItem>) => {
        set(state => ({
          documentItems: state.documentItems.map(item => 
            item.id === id ? { ...item, ...updatedData } : item
          )
        }));
        get().updateFilteredData();
      },

      archiveDocumentItem: (id: number) => {
        set(state => ({
          documentItems: state.documentItems.map(item => 
            item.id === id ? { ...item, status: "비활성", statusIcon: InActiveIcon } : item
          )
        }));
        get().updateFilteredData();
      },

      getFilteredData: (currentPage: number, itemsPerPage: number) => {
        const { filteredData } = get();
        const totalItems = filteredData.length;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        return {
          paginatedData: filteredData.slice(startIndex, endIndex),
          totalItems
        };
      },

      getDocumentStats: () => {
        const { documentItems } = get();
        const total = documentItems.length;
        const active = documentItems.filter(item => item.status === "활성").length;
        const inactive = documentItems.filter(item => item.status === "비활성").length;

        return {
          totalDocuments: total,
          activeDocuments: active,
          inactiveDocuments: inactive
        };
      },

      formatStatsForDisplay: () => {
        const stats = get().getDocumentStats();
        return [
          { 
            title: "총 문서 수", 
            value: `${stats.totalDocuments.toLocaleString()}개`, 
            additionalInfo: "+2개 이번 주" 
          },
          { 
            title: "활성 문서 수", 
            value: `${stats.activeDocuments.toLocaleString()}개`, 
            additionalInfo: "+1개 이번 주" 
          },
          { 
            title: "비활성 문서 수", 
            value: `${stats.inactiveDocuments.toLocaleString()}개`, 
            additionalInfo: "+1개 이번 달" 
          }
        ];
      }
    }),
    {
      name: 'document-store'
    }
  )
);

export type { DocumentItem }; 