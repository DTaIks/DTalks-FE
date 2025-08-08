export interface DocumentItem {
  documentId: number;
  documentName: string;
  category: string;
  latestVersion: string;
  uploaderName: string;
  fileUrl: string;
  lastUpdatedAt: string;
  isActive: boolean;
}

export interface TableProps {
  currentPage: number;
  itemsPerPage: number;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
  };
}

export interface TableHeaderProps {
  searchTerm: string;
  selectedStatus: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (value: string) => void;
}

// BaseDocumentItem이 제거되었으므로 TableRowProps도 제거합니다.
// 이 인터페이스는 현재 사용되지 않습니다.
