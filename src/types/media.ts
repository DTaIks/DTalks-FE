// 모달 관련 타입들을 modal.ts에서 import
export type { MediaUploadModalProps, MediaUploadData, VersionHistoryModalProps, MediaArchiveModalProps } from './modal';

export interface CommonFileInfo {
  fileId: number;
  fileName: string;
  fileSize: string;
  updatedAt: string;
  department: string;
  description: string;
  fileUrl: string;
  latestFileVersionNumber: string;
  fileType: string;
}

export interface DepartmentFileInfo {
  fileId: number;
  fileName: string;
  fileSize: string;
  updatedAt: string;
  department: string;
  description: string;
  fileUrl: string;
  latestFileVersionNumber: string;
  fileType: string;
}

export interface PagingInfo {
  currentPageNumber: number;
  pageSize: number;
  elementCount: number;
  totalPageCount: number;
  isLastPage: boolean;
  isEmpty: boolean;
}

export interface CommonFileResponse {
  commonFileInfoList: CommonFileInfo[];
  pagingInfo: PagingInfo;
  fileType: string;
}

export interface DepartmentFileResponse {
  departmentFileInfoList: DepartmentFileInfo[];
  pagingInfo: PagingInfo;
  fileType: string;
}

export interface CommonFileRequest {
  option?: string;
  pageNumber: number;
  fileType?: string;
}

export interface DepartmentFileRequest {
  departmentName: string;
  option?: string;
  pageNumber: number;
  fileType?: string;
}

export interface CommonArchivedFileInfo {
  fileId: number;
  fileName: string;
  fileSize: string;
  updatedAt: string;
  department: string;
  description: string;
  fileUrl: string;
  latestFileVersionNumber: string;
  fileType: string;
}

export interface CommonArchivedFileResponse {
  commonArchivedFileInfoList: CommonArchivedFileInfo[];
  pagingInfo: PagingInfo;
  fileType: string;
}

export interface CommonArchivedFileRequest {
  option?: string;
  pageNumber: number;
  fileType?: string;
}

export interface DepartmentArchivedFileRequest {
  option?: string;
  departmentName: string;
  pageNumber: number;
  fileType?: string;
}

export interface DepartmentArchivedFileResponse {
  departmentArchivedFileInfoList: CommonArchivedFileInfo[];
  pagingInfo: PagingInfo;
  fileType: string;
}

export interface FileUploadInfo {
  fileName: string;
  description: string;
  fileVersion: string;
  isPublic: boolean;
}

export interface FileUploadResponse {
  fileId: number;
  fileUrl: string;
}

// UI 관련 타입들
export interface MediaFile {
  fileId: number;
  fileName: string;
  fileSize: string;
  updatedAt: string;
  fileType?: '문서' | '이미지' | '음성';
  departmentName?: string;
  department?: string;
  description?: string;
  fileVersion: string;
  isPublic?: boolean;
  fileUrl?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface VersionData {
  id: string;
  version: string;
  date: string;
  uploaderName: string;
  fileSize: string;
  description?: string;
  updatedAt: string;
}

export interface FileVersionHistory {
  versionId: number;
  versionNumber: string;
  createdAt: string;
  description: string;
  uploaderName: string;
}

// 미디어 관련 컴포넌트 Props 타입들

// MediaContent 컴포넌트
export interface MediaContentProps {
  selectedDepartment: string;
  selectedFileType: '전체' | '문서' | '이미지' | '음성';
  isArchiveMode: boolean;
  files: MediaFile[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  handlers: {
    handleDownloadClick: (fileName: string, fileUrl?: string) => void;
    handleArchiveClick: (fileName: string) => void;
    handleVersionManagementClick: (fileName: string, fileId?: number) => void;
    handleEditClick: (file: MediaFile) => void;
    handleUploadSubmit: (data: { uploadFile?: File; fileName: string; description: string; fileVersion: string; isPublic: boolean }) => void;
    handleConfirmAction: () => void;
    handleDocumentArchive: (documentId: number) => void;
  };
  onSelectFileType: (fileType: '전체' | '문서' | '이미지' | '음성') => void;
  onPageChange: (page: number) => void;
}

// MediaFileContent 컴포넌트
export interface MediaFileContentProps {
  file: MediaFile;
  isArchiveMode?: boolean;
  handlers: { 
    handleDownloadClick: (fileName: string, fileUrl?: string) => void;
    handleArchiveClick: (fileName: string) => void;
    handleVersionManagementClick: (fileName: string, fileId?: number) => void;
    handleEditClick: (file: MediaFile) => void;
    handleUploadSubmit: (data: { uploadFile?: File; fileName: string; description: string; fileVersion: string; isPublic: boolean }) => void;
    handleConfirmAction: () => void;
    handleDocumentArchive: (documentId: number) => void;
  };
}

// MediaSidebar 컴포넌트
export interface MediaSidebarProps {
  departments: Array<{ id: string; name: string }>;
  selectedDepartment: string;
  isArchiveMode: boolean;
  isArchiveClosing: boolean;
  onSelectDepartment: (department: string) => void;
  onToggleArchive: (isArchive: boolean) => void;
  onSelectArchiveDepartment: (department: string) => void;
}

// MediaHeader 컴포넌트
export interface MediaFileContentHeaderProps {
  selectedTeam: string;
}
