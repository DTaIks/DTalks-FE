export interface User {
  userId: number;
  userName: string;
  department: string;
  email: string;
  role: string;
}

export interface PagingInfo {
  currentPageNumber: number; 
  pageSize: number;
  elementCount: number;      
  totalPageCount: number;     
  isLastPage: boolean;
  isEmpty: boolean;
}

export interface AdminUserListRequest {
  pageNumber: number; 
  pageSize?: number;
}

export interface AdminUserListResponse {
  code: number;
  status: string;
  message: string;
  data: {
    adminInfoList: User[];
    pagingInfo: PagingInfo;
  };
}

export interface AdminUserSearchRequest {
  name: string;
  pageNumber: number;
  pageSize?: number;
}

export interface AdminUserSearchResponse {
  code: number;
  status: string;
  message: string;
  data: {
    adminInfoList: User[];
    pagingInfo: PagingInfo;
  };
}
