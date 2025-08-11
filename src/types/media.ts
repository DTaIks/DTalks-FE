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
