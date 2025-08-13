// 레이아웃 관련 컴포넌트 Props 타입들

// Sidebar 컴포넌트
export interface DropdownIconProps {
  isOpen: boolean;
  onClick: () => void;
}

export interface MenuItemProps {
  isSelected?: boolean;
  isToggle?: boolean;
}

export interface SubMenuItemProps {
  isSelected?: boolean;
}

// TitleContainer 컴포넌트
export interface TitleContainerProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

// MediaSidebar 컴포넌트
export interface MediaSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    count: number;
  }>;
}

// MediaContent 컴포넌트
export interface MediaContentProps {
  selectedCategory: string;
  onFileUpload: () => void;
  onFileSelect: (file: { fileId: number; fileName: string; fileSize: number; uploadDate: string; uploader: string; isActive: boolean }) => void;
  onFileArchive: (fileId: number) => void;
  onFileDownload: (fileId: number) => void;
  onVersionHistory: (fileId: number) => void;
  files: Array<{
    fileId: number;
    fileName: string;
    fileSize: number;
    uploadDate: string;
    uploader: string;
    isActive: boolean;
  }>;
  isLoading?: boolean;
}

// MediaFileContentList 컴포넌트
export interface MediaFileContentProps {
  files: Array<{
    fileId: number;
    fileName: string;
    fileSize: number;
    uploadDate: string;
    uploader: string;
    isActive: boolean;
  }>;
  onFileSelect: (file: { fileId: number; fileName: string; fileSize: number; uploadDate: string; uploader: string; isActive: boolean }) => void;
  onFileArchive: (fileId: number) => void;
  onFileDownload: (fileId: number) => void;
  onVersionHistory: (fileId: number) => void;
  isLoading?: boolean;
}

// MediaHeader 컴포넌트
export interface MediaFileContentHeaderProps {
  selectedCategory: string;
  onUploadClick: () => void;
  totalFiles: number;
}

// DepartmentList 컴포넌트
export interface DepartmentBoxProps {
  department: {
    id: string;
    name: string;
    memberCount: number;
    icon: string;
  };
  isSelected: boolean;
  onClick: () => void;
}
