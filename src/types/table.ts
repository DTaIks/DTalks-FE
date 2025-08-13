import type { DocumentInfo } from '@/types/document';

export interface DocumentItem {
  documentId: number;
  documentName: string;
  latestVersion: string;
  category: string;
  fileUrl: string;
  isActive: boolean;
}

export interface UserItem {
  userId: number;
  name: string;
  email: string;
  department: string;
  position: string;
  isActive: boolean;
}

export interface CommonModals {
  confirmModal: {
    open: (type: 'archive' | 'download', fileName: string) => void;
    close: () => void;
  };
  versionModal: {
    open: (fileName: string) => void;
    close: () => void;
    isOpen: boolean;
  };
}

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
  error?: Error | null;
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
  onDocumentsLoaded?: (documents: DocumentItem[]) => void;
}

// DocumentCommonTable 컴포넌트
export interface DocumentCommonTableProps {
  documents: DocumentItem[];
  modals: CommonModals;
  isLoading?: boolean;
  error?: Error | null;
  onUpdate?: (documentName: string) => void;
}

// DocumentAllTable 컴포넌트
export interface DocumentAllTableProps {
  documents: DocumentInfo[];
  modals: CommonModals;
  isLoading?: boolean;
  error?: Error | null;
  isSearchMode?: boolean;
  searchTerm?: string;
  selectedCategory?: string;
  selectedStatus?: string;
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange?: (category: string) => void;
  onStatusChange?: (status: string) => void;
  onUpdate?: (documentName: string) => void;
}

// UserTable 관련 Props
export interface UserTableRowProps {
  user: UserItem;
  onEdit?: (userId: number) => void;
  onArchive?: (userId: number, isArchived?: boolean) => void;
}

export interface UserTableHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export interface UserTableBodyProps {
  users: UserItem[];
  onEdit?: (userId: number) => void;
  onArchive?: (userId: number, isArchived?: boolean) => void;
}

// FAQTable 관련 Props
export interface FAQItem {
  faqId: number;
  question: string;
  category: string;
  categoryImage: string;
  isActive: boolean;
  updatedAt: string;
  answer?: string;
}

export interface FAQTableRowProps {
  faq: FAQItem;
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

export interface FAQTableBodyProps {
  faqs: FAQItem[];
  expandedRows: Set<number>;
  onRowToggle: (faqId: number) => void;
  onEdit: (faqId: number) => void;
  onArchiveClick: (faqId: number, faqName: string) => void;
}

export interface PermissionItem {
  permissionId: number;
  permissionName: string;
  description: string;
  isActive: boolean;
}

export interface PermissionTableRowProps {
  permission: PermissionItem;
  onEdit?: (permissionId: number) => void;
  onArchive?: (permissionId: number, isArchived?: boolean) => void;
}

export interface PermissionTableHeaderProps {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface PermissionTableBodyProps {
  permissions: PermissionItem[];
  onEdit?: (permissionId: number) => void;
  onArchive?: (permissionId: number, isArchived?: boolean) => void;
}

export interface ReportFormItem {
  reportId: number;
  reportName: string;
  category: string;
  latestVersion: string;
  isActive: boolean;
  fileUrl?: string;
}

export interface ReportFormTableProps {
  reports: ReportFormItem[];
  onArchive?: (id: number, isArchived?: boolean) => void;
  onUpdate?: (reportName: string) => void;
  onVersionHistory?: (fileName: string) => void;
  onConfirmModalOpen?: (type: 'archive' | 'download', fileName: string) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export interface ReportFormTableRowProps {
  report: ReportFormItem;
  onArchive?: (id: number, isArchived?: boolean) => void;
  onUpdate?: (reportName: string) => void;
  onVersionHistory?: (fileName: string) => void;
  onConfirmModalOpen?: (type: 'archive' | 'download', fileName: string) => void;
}

export interface TableStateProps {
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface SearchFilterProps {
  searchTerm: string;
  selectedCategory?: string;
  selectedStatus?: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange?: (category: string) => void;
  onStatusChange?: (status: string) => void;
}

export interface CommonActionsProps {
  onEdit?: (id: number) => void;
  onArchive?: (id: number, isArchived?: boolean) => void;
  onUpdate?: (name: string) => void;
  onVersionHistory?: (fileName: string) => void;
  onDownload?: (fileName: string, fileUrl?: string) => void;
}
