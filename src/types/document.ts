export interface DocumentInfo {
  documentId: number;
  documentName: string;
  category: string;
  latestVersion: string;
  uploaderName: string;
  fileUrl: string;
  lastUpdatedAt: string;
  isActive: boolean;
  isArchived?: boolean;
}

export interface DocumentPagingInfo {
  currentPageNumber: number;
  pageSize: number;
  elementCount: number;
  totalPageCount: number;
  isLastPage: boolean;
  isEmpty: boolean;
}

export interface DocumentResponse {
  documentInfoResponseList: DocumentInfo[];
  pagingInfo: DocumentPagingInfo;
}

export interface DocumentRequest {
  categoryName?: string;
  pageNumber: number;
  pageSize?: number;
}
