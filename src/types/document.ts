export interface DocumentInfo {
  documentId: number;
  documentName: string;
  category: string;
  latestVersion: string;
  uploaderName: string;
  fileUrl: string;
  lastUpdatedAt: string;
  isActive: boolean;
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

export interface DocumentSearchRequest {
  category: string;
  fileName: string;
  pageNumber: number;
  pageSize?: number;
}

// 문서 버전 관리 관련 수정된 타입들
export interface DocumentVersion {
  versionId: number;
  versionNumber: string;
  createdAt: string;
  uploader: string;
}

export interface DocumentVersionInfo {
  documentId: number;
  documentName: string;
  versions: DocumentVersion[];
}

export interface DocumentVersionResponse {
  documents: DocumentVersionInfo[];
}

// 버전 선택용 옵션 타입
export interface VersionOption {
  value: string;         
  label: string;       
  versionId: number;    
  versionNumber: string;  
  createdAt: string;     
  uploader: string;     
}

// 문서 정보 (검색용)
export interface DocumentSearchInfo {
  documentName: string;
  description?: string;
  lastModified?: string;
  category?: string;
}

// 카테고리 매핑용 타입
export type CategoryType = 'policy' | 'glossary' | 'reportform';
