import { create } from 'zustand';
import type { MediaUploadData } from '@/components/admin/media/MediaFileUploadModal';

type FileType = '전체' | '문서' | '이미지' | '음성';
type ModalType = 'archive' | 'download';

interface MediaUIState {
  // 필터 상태
  selectedDepartment: string;
  selectedFileType: FileType;
  
  // 보관함 상태
  isArchiveMode: boolean;
  isArchiveClosing: boolean;
  
  // 페이지네이션 상태
  currentPage: number;
  
  // 선택된 파일 정보
  selectedFile: { fileId: number | null; fileName: string } | null;
  
  // 모달 상태
  uploadModal: {
    isOpen: boolean;
    isEditMode: boolean;
    initialData: MediaUploadData | null;
  };
  
  confirmModal: {
    isOpen: boolean;
    type: ModalType;
    fileName: string;
  };
  
  versionModal: {
    isOpen: boolean;
    fileName: string;
    fileId?: number;
  };
}

interface MediaUIActions {
  // 필터 액션
  setSelectedDepartment: (department: string) => void;
  setSelectedFileType: (fileType: FileType) => void;
  
  // 보관함 액션
  setArchiveMode: (isMode: boolean) => void;
  setArchiveClosing: (isClosing: boolean) => void;
  
  // 페이지네이션 액션
  setCurrentPage: (page: number) => void;
  resetPage: () => void;
  
  // 선택된 파일 액션
  setSelectedFile: (file: { fileId: number; fileName: string } | null) => void;
  
  // 모달 액션
  openUploadModal: () => void;
  closeUploadModal: () => void;
  openEditModal: (initialData: MediaUploadData) => void;
  
  openConfirmModal: (type: ModalType, fileName: string) => void;
  closeConfirmModal: () => void;
  
  openVersionModal: (fileName: string, fileId?: number) => void;
  closeVersionModal: () => void;
  
  // 전체 리셋
  resetAll: () => void;
}

const initialState: MediaUIState = {
  selectedDepartment: '전체 파일',
  selectedFileType: '전체',
  isArchiveMode: false,
  isArchiveClosing: false,
  currentPage: 1,
  selectedFile: null,
  uploadModal: {
    isOpen: false,
    isEditMode: false,
    initialData: null,
  },
  confirmModal: {
    isOpen: false,
    type: 'download',
    fileName: '',
  },
  versionModal: {
    isOpen: false,
    fileName: '',
    fileId: undefined,
  },
};

export const useMediaStore = create<MediaUIState & MediaUIActions>()(
  (set, get) => ({
    ...initialState,
    
    // 필터 액션
    setSelectedDepartment: (department) => {
      set({ selectedDepartment: department, currentPage: 1 });
    },
    
    setSelectedFileType: (fileType) => {
      set({ selectedFileType: fileType, currentPage: 1 });
    },
    
    // 보관함 액션
    setArchiveMode: (isMode) => {
      set({ isArchiveMode: isMode, currentPage: 1 });
    },
    
    setArchiveClosing: (isClosing) => {
      set({ isArchiveClosing: isClosing });
    },
    
    // 페이지네이션 액션
    setCurrentPage: (page) => {
      set({ currentPage: page });
    },
    
    resetPage: () => {
      set({ currentPage: 1 });
    },
    
    // 선택된 파일 액션
    setSelectedFile: (file) => {
      set({ selectedFile: file });
    },
    
    // 모달 액션
    openUploadModal: () => {
      set({
        uploadModal: {
          isOpen: true,
          isEditMode: false,
          initialData: null,
        },
      });
    },
    
    closeUploadModal: () => {
      set({
        uploadModal: {
          isOpen: false,
          isEditMode: false,
          initialData: get().uploadModal.initialData,
        },
      });
    },
    
    openEditModal: (initialData) => {
      set({
        uploadModal: {
          isOpen: true,
          isEditMode: true,
          initialData,
        },
      });
    },
    
    openConfirmModal: (type, fileName) => {
      set({
        confirmModal: {
          isOpen: true,
          type,
          fileName,
        },
      });
    },
    
    closeConfirmModal: () => {
      set({
        confirmModal: {
          isOpen: false,
          type: 'download',
          fileName: '',
        },
      });
    },
    
    openVersionModal: (fileName, fileId) => {
      set({
        versionModal: {
          isOpen: true,
          fileName,
          fileId,
        },
      });
    },
    
    closeVersionModal: () => {
      set({
        versionModal: {
          isOpen: false,
          fileName: '',
          fileId: undefined,
        },
      });
    },
    
    // 전체 리셋
    resetAll: () => {
      set(initialState);
    },
  })
);
