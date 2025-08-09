// 사용자 정보 인터페이스
export interface User {
  userId: number;
  userName: string;
  department: string;
  role: string;
  email: string;
}

// 페이징 정보 인터페이스
export interface PagingInfo {
  currentPageNumber: number;
  pageSize: number;
  elementCount: number;
  totalPageCount: number;
  isLastPage: boolean;
  isEmpty: boolean;
}

// 실제 데이터 부분의 인터페이스
export interface AdminUserListData {
  adminInfoList: User[];
  pagingInfo: PagingInfo;
}

// 전체 API 응답 인터페이스
export interface AdminUserListResponse {
  code: number;
  status: string;
  message: string;
  data: AdminUserListData;
}

// 기본 목록 요청 파라미터
export interface AdminUserListRequest {
  pageNumber: number;
  pageSize?: number;
}

// 검색 요청 파라미터
export interface AdminUserSearchRequest {
  name: string;
  pageNumber: number;
  pageSize?: number;
}

// 검색 응답 - 구조는 동일하므로 타입 별칭 사용
export type AdminUserSearchResponse = AdminUserListResponse;
