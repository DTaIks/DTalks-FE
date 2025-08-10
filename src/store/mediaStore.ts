import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MediaUploadData } from '@/components/admin/media/MediaFileUploadModal';

interface MediaUIState {
  // 필터 상태
  selectedDepartment: string;
  selectedFileType: '전체' | '문서' | '이미지' | '음성';
  
  // 보관함 상태
  isArchiveMode: boolean;
  isArchiveClosing: boolean;
  
  // 페이지네이션 상태
  currentPage: number;
  
  // 선택된 파일 정보 (수정용)
  selectedFile: {
    fileId: number | null;
    fileName: string;
  } | null;
  
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
  setSelectedFileType: (fileType: '전체' | '문서' | '이미지' | '음성') => void;
  
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
  
  openConfirmModal: (type: 'archive' | 'download', fileName: string) => void;
  closeConfirmModal: () => void;
  
  openVersionModal: (fileName: string) => void;
  closeVersionModal: () => void;
  
  // 전체 리셋
  resetAll: () => void;
}

const initialState: MediaUIState = {
  selectedDepartment: '전체 파일',
  selectedFileType: '전체',
  isArchiveMode: false,
  isArchiveClosing: false,
  currentPage: 1, // 페이지 번호를 1부터 시작하도록 수정
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
  },
};

export const useMediaStore = create<MediaUIState & MediaUIActions>()(
  persist(
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
            initialData: get().uploadModal.initialData, // 기존 initialData 유지
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
    }),
    {
      name: 'media-store', // localStorage 키 이름
      partialize: (state) => ({
        // 모달 상태는 저장하지 않음 (세션별로 초기화)
        selectedDepartment: state.selectedDepartment,
        selectedFileType: state.selectedFileType,
        isArchiveMode: state.isArchiveMode,
        currentPage: state.currentPage,
      }),
    }
  )
);
