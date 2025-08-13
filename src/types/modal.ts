// UploadBaseModal 컴포넌트
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  submitDisabled?: boolean;
  isSubmitting?: boolean;
}

// DocumentUploadModal 컴포넌트
export interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DocumentUploadData) => void;
  isSubmitting?: boolean;
  pageType?: 'policy' | 'reportform' | 'glossary' | 'document';
  mode?: 'upload' | 'update';
  initialData?: {
    fileId?: number;
    fileName: string;
    description: string;
    fileVersion: string;
    category: string;
    fileUrl?: string;
  };
}
// DocumentUploadData 타입
export interface DocumentUploadData {
  fileId?: number;
  uploadFile?: File;
  fileName: string;
  description: string;
  fileVersion: string;
  category: string;
}

// MediaUploadModal 컴포넌트
export interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MediaUploadData) => void;
  isSubmitting?: boolean;
  mode?: 'upload' | 'update';
  initialData?: {
    fileId?: number;
    fileName: string;
    description: string;
    fileVersion: string;
    category: string;
    fileUrl?: string;
  };
}
// MediaUploadData 타입
export interface MediaUploadData {
  fileId?: number;
  uploadFile?: File;
  fileName: string;
  description: string;
  fileVersion: string;
  category: string;
}

// FAQUploadModal 컴포넌트
export interface FAQUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FAQUploadData) => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
  initialData?: {
    faqId?: number;
    question: string;
    answer: string;
    category: string;
  };
}
// FAQUploadData 타입
export interface FAQUploadData {
  faqId?: number;
  question: string;
  answer: string;
  category: string;
}

// ArchiveModal 컴포넌트
export interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  isLoading?: boolean;
}

// 미디어 전용 ArchiveModal Props (부서 선택 기능 포함)
export interface MediaArchiveModalProps {
  isOpen: boolean;
  isClosing: boolean;
  departments: Array<{ id: string; name: string }>;
  selectedDepartment: string;
  onClose: () => void;
  onSelectDepartment: (department: string) => void;
}

// VersionHistoryModal 컴포넌트
export interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileId?: number;
  pageType?: 'media' | 'document';
}

// 모달 내부 컴포넌트 Props
export interface FileSelectInputProps {
  fileDisplayName: string;
  onFileDisplayNameChange: (name: string) => void;
  onFileChange: (file: File | null) => void;
  accept?: string;
  placeholder?: string;
  maxSizeInMB?: number;
  onFileError?: (error: string) => void;
  fileError?: string;
  disabled?: boolean;
  optional?: boolean;
}

export interface FileNameInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
}

export interface FileDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
}

export interface VersionInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
}

export interface FileCategoryProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  error?: string;
}

export interface UploadInfoCardProps {
  infoItems: string[];
  title?: string;
}

export interface FilePublicSettingProps {
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
}
