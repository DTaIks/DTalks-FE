// Button 컴포넌트
export interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'submit' | 'login';
  type?: 'button' | 'submit' | 'reset';
  width?: string;
  height?: string;
  fontSize?: string;
  disabled?: boolean;
  isLoading?: boolean;
  isCompleted?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

// InputField 컴포넌트
export interface InputFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}

// ConfirmModal 컴포넌트
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  type: 'archive' | 'download';
  isLoading?: boolean;
}

// EmptyState 컴포넌트
export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
}

// Pagination 컴포넌트
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

// CustomDropdown 컴포넌트
export interface CustomDropdownProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

// DropDownButton 컴포넌트
export interface DropDownButtonProps {
  options: Array<{ value: string; label: string }>;
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// LogoutModal 컴포넌트
export interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}
