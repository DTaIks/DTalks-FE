import { create } from 'zustand';
import type { MediaUploadData } from '@/components/admin/media/MediaFileUploadModal';

interface MediaUIState {
  // 필터 상태
  selectedDepartment: string;
  selectedFileType: 'document' | 'image' | 'audio' | 'all';
  
  // 보관함 상태
  isArchiveMode: boolean;
  isArchiveClosing: boolean;
  
  // 페이지네이션 상태
  currentPage: number;
  
  // 모달 상태
  uploadModal: {
    isOpen: boolean;
    isEditMode: boolean;
    initialData: MediaUploadData | null;
  };
  
  confirmModal: {
    isOpen: boolean;
    type: 'archive' | 'download';
    fileName: string;
  };
  
  versionModal: {
    isOpen: boolean;
    fileName: string;
  };
}

interface MediaUIActions {
  // 필터 액션
  setSelectedDepartment: (department: string) => void;
  setSelectedFileType: (fileType: 'document' | 'image' | 'audio' | 'all') => void;
  
  // 보관함 액션
  setArchiveMode: (isMode: boolean) => void;
  setArchiveClosing: (isClosing: boolean) => void;
  
  // 페이지네이션 액션
  setCurrentPage: (page: number) => void;
  resetPage: () => void;
  
  // 모달 액션
  openUploadModal: () => void;
  closeUploadModal: () => void;
  openEditModal: (initialData: MediaUploadData) => void;
  
  openConfirmModal: (type: 'archive' | 'download', fileName: string) => void;
  closeConfirmModal: () => void;
  
  openVersionModal: (fileName: string) => void;
  closeVersionModal: () => void;
  
  // 전체 리셋
  resetAll: () => void;
}

const initialState: MediaUIState = {
  selectedDepartment: '전체 파일',
  selectedFileType: 'all',
  isArchiveMode: false,
  isArchiveClosing: false,
  currentPage: 0, // 페이지 번호를 0부터 시작하도록 수정
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
  },
};

export const useMediaStore = create<MediaUIState & MediaUIActions>((set, get) => ({
  ...initialState,
  
  // 필터 액션
  setSelectedDepartment: (department) => {
    set({ selectedDepartment: department, currentPage: 0 });
  },
  
  setSelectedFileType: (fileType) => {
    set({ selectedFileType: fileType, currentPage: 0 });
  },
  
  // 보관함 액션
  setArchiveMode: (isMode) => {
    set({ isArchiveMode: isMode, currentPage: 0 });
  },
  
  setArchiveClosing: (isClosing) => {
    set({ isArchiveClosing: isClosing });
  },
  
  // 페이지네이션 액션
  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
  
  resetPage: () => {
    set({ currentPage: 0 });
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
        initialData: null,
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
  
  openVersionModal: (fileName) => {
    set({
      versionModal: {
        isOpen: true,
        fileName,
      },
    });
  },
  
  closeVersionModal: () => {
    set({
      versionModal: {
        isOpen: false,
        fileName: '',
      },
    });
  },
  
  // 전체 리셋
  resetAll: () => {
    set(initialState);
  },
}));
