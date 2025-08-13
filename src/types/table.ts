// 테이블 관련 컴포넌트 Props 타입들

// DocumentItem 타입
export interface DocumentItem {
  documentId: number;
  documentName: string;
  latestVersion: string;
  category: string;
  fileUrl: string;
  isActive: boolean;
  uploaderName: string;
  lastUpdatedAt: string;
}

// CommonTable 컴포넌트
export interface CommonTableProps {
  title: string;
  items: Array<{
    id: number;
    name: string;
    status: string;
    category: string;
    updatedAt: string;
    isActive: boolean;
  }>;
  searchTerm: string;
  selectedStatus: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: string) => void;
  onArchive?: (id: number, isArchived?: boolean) => void;
  onUpdate?: (documentName: string) => void;
  categoryImage: string;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
    handleVersionHistoryClick: ((fileName: string) => void) | undefined;
  };
  isLoading?: boolean;
}

// DocumentTable 컴포넌트 (admin/documentAll)
export interface DocumentTableProps {
  category: 'policy' | 'glossary' | 'reportform';
  title: string;
  categoryImage: string;
  onArchive?: (id: number, isArchived?: boolean) => void;
  onVersionHistoryClick?: (fileName: string) => void;
  onConfirmModalOpen?: (type: 'archive' | 'download', fileName: string) => void;
  onUpdate?: (documentName: string) => void;
  onDocumentsLoaded?: (documents: Array<{
    documentId: number;
    documentName: string;
    latestVersion: string;
    category: string;
    fileUrl: string;
    isActive: boolean;
  }>) => void;
}

// DocumentCommonTable 컴포넌트
export interface DocumentCommonTableProps {
  documents: Array<{
    documentId: number;
    documentName: string;
    latestVersion: string;
    category: string;
    fileUrl: string;
    isActive: boolean;
  }>;
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
      close: () => void;
    };
    versionModal: {
      open: (fileName: string) => void;
      close: () => void;
      isOpen: boolean;
    };
  };
  isLoading?: boolean;
  error?: Error | null;
  onUpdate?: (documentName: string) => void;
}

// DocumentAllTable 컴포넌트
export interface DocumentAllTableProps {
  documents: import('@/types/document').DocumentInfo[];
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
      close: () => void;
    };
    versionModal: {
      open: (fileName: string) => void;
      close: () => void;
      isOpen: boolean;
    };
  };
  isLoading?: boolean;
  error?: Error | null;
  onUpdate?: (documentName: string) => void;
}

// UserTable 관련 Props
export interface UserTableRowProps {
  user: {
    userId: number;
    name: string;
    email: string;
    department: string;
    position: string;
    isActive: boolean;
  };
  onEdit?: (userId: number) => void;
  onArchive?: (userId: number, isArchived?: boolean) => void;
}

export interface UserTableHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export interface UserTableBodyProps {
  users: Array<{
    userId: number;
    name: string;
    email: string;
    department: string;
    position: string;
    isActive: boolean;
  }>;
  onEdit?: (userId: number) => void;
  onArchive?: (userId: number, isArchived?: boolean) => void;
}

// FAQTable 관련 Props
export interface FAQTableRowProps {
  faq: {
    faqId: number;
    question: string;
    category: string;
    categoryImage: string;
    isActive: boolean;
    updatedAt: string;
    answer?: string;
  };
  isExpanded: boolean;
  onRowToggle: (faqId: number) => void;
  onEdit: (faqId: number) => void;
  onArchiveClick: (faqId: number, faqName: string) => void;
}

export interface FAQTableHeaderProps {
  searchTerm: string;
  selectedCategory: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (categoryValue: string) => void;
  categoryOptions: Array<{ value: string; label: string }>;
}

// PermissionTable 관련 Props
export interface PermissionTableRowProps {
  permission: {
    permissionId: number;
    permissionName: string;
    description: string;
    isActive: boolean;
  };
  onEdit?: (permissionId: number) => void;
  onArchive?: (permissionId: number, isArchived?: boolean) => void;
}


