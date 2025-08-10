export interface CommonFileInfo {
  fileId: number;
  fileName: string;
  fileSize: string;
  updatedAt: string;
  department: string;
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
}

export interface CommonFileRequest {
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
