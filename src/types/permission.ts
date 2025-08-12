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
