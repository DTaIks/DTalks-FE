// 권한 관리 관련 컴포넌트 Props 타입들

// RoleManagement 컴포넌트
export interface RoleManagementProps {
  roles: Array<{
    roleId: number;
    roleName: string;
    description: string;
    userCount: number;
    isActive: boolean;
  }>;
  onRoleSelect: (roleId: number) => void;
  onRoleCreate: () => void;
  onRoleEdit: (roleId: number) => void;
  onRoleArchive: (roleId: number) => void;
  selectedRoleId?: number;
  isLoading?: boolean;
}

// RoleInfoSection 컴포넌트
export interface RoleInfoSectionProps {
  role: {
    roleId: number;
    roleName: string;
    description: string;
    userCount: number;
    isActive: boolean;
  };
  onEdit: () => void;
}

// RoleUserTable 컴포넌트
export interface UserTableProps {
  users: Array<{
    userId: number;
    name: string;
    email: string;
    department: string;
    position: string;
    isActive: boolean;
  }>;
  onUserRemove: (userId: number) => void;
  isLoading?: boolean;
}

// RoleUserSearchSection 컴포넌트
export interface UserSearchSectionProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  searchResults: Array<{
    userId: number;
    name: string;
    email: string;
    department: string;
    position: string;
  }>;
  onUserAdd: (userId: number) => void;
  isLoading?: boolean;
}

// RoleModalHeader 컴포넌트
export interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

// RoleSaveButtonSection 컴포넌트
export interface ActionSectionProps {
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// PermissionTableRow 컴포넌트
export interface PermissionTableRowProps {
  permission: {
    permissionId: number;
    permissionName: string;
    description: string;
    isActive: boolean;
  };
  onEdit?: (permissionId: number) => void;
  onArchive?: (permissionId: number, isArchived?: boolean) => void;
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
