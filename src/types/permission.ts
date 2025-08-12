export interface PermissionUser {
  roleId: number;
  roleName: string;
  roleNameEn: string;
  description: string;
  roleUserCount: number;
  isActive: string;
  image: string;
}

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

// 권한 목록 조회 응답
export interface PermissionResponse {
  code: number;
  status: string;
  message: string;
  data: {
    roleId: number;
    roleUserCount: number;
    isActive: string;
  }[];
}

// 권한 기준 사용자 목록 조회 요청
export interface AdminRoleInfoRequest {
  roleId: number;
  pageNumber: number;
  pageSize?: number;
}

// 권한 기준 사용자 목록 조회 응답
export interface AdminRoleInfoResponse {
  code: number;
  status: string;
  message: string;
  data: {
    adminRoleInfoList: User[];
    pagingInfo: PagingInfo;
  };
}

// 권한 기준 사용자 검색 요청
export interface AdminRoleSearchRequest {
  roleId: number;
  name: string;
  pageNumber: number;
  pageSize?: number;
}

// 권한 기준 사용자 검색 응답
export interface AdminRoleSearchResponse {
  code: number;
  status: string;
  message: string;
  data: {
    adminRoleInfoList: User[];
    pagingInfo: PagingInfo;
  };
}

// 사용자 권한 변경 요청
export interface ChangeUserRoleRequest {
  userIdList: number[];
  roleId: number;
}

// 사용자 권한 변경 응답
export interface ChangeUserRoleResponse {
  code: number;
  status: string;
  message: string;
  data?: {
    changedCount?: number;
    successUserIds?: number[];
    failedUserIds?: number[];
  };
}
