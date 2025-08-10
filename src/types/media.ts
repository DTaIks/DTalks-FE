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
  fileType?: 'document' | 'audio' | 'image';
  departmentName?: string;
  department?: string;
  description?: string;
  fileVersion: string;
  isPublic?: boolean;
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
