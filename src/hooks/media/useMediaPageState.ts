import { useState, useCallback, useMemo } from 'react';
import { useArchivedFilesStore } from '@/store/archivedFileStore';
import { useFiles, type MediaFile } from '@/hooks/media/useMediaFile';
import type { MediaUploadData } from '@/components/admin/media/MediaFileUploadModal';

export const useMediaPageState = () => {
  // UI 상태들
  const [selectedDepartment, setSelectedDepartment] = useState<string>('전체 파일');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedFileType, setSelectedFileType] = useState<'document' | 'image' | 'audio' | 'all'>('all');
  const [isArchiveMode, setIsArchiveMode] = useState<boolean>(false);
  const [isArchiveClose, setIsArchiveClose] = useState<boolean>(false);
  
  // 모달 상태들
  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'archive' | 'download'>('download');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editInitialData, setEditInitialData] = useState<MediaUploadData | null>(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false);

  const files = useFiles();
  const { archivedFiles } = useArchivedFilesStore();

  // 파일 필터링 로직
  const filteredFiles = useMemo((): MediaFile[] => {
    let filteredFiles = files;
    
    // 보관 모드에 따라 필터링
    if (isArchiveMode) {
      filteredFiles = filteredFiles.filter(file => archivedFiles.includes(file.fileId));
    } else {
      filteredFiles = filteredFiles.filter(file => !archivedFiles.includes(file.fileId));
    }
    
    // 부서별 필터링
    if (selectedDepartment !== '전체 파일') {
      filteredFiles = filteredFiles.filter(file => file.departmentName === selectedDepartment);
    }
    
    // 파일 타입별 필터링
    if (selectedFileType !== 'all') {
      filteredFiles = filteredFiles.filter(file => file.fileType === selectedFileType);
    }
    
    return filteredFiles;
  }, [files, archivedFiles, isArchiveMode, selectedDepartment, selectedFileType]);

  // 부서 선택 핸들러
  const handleDepartmentSelect = useCallback((departmentName: string): void => {
    setSelectedDepartment(departmentName);
    setSelectedFileType('all');
    if (!isArchiveMode) {
      setIsArchiveMode(false);
    }
  }, [isArchiveMode]);

  // 보관함에서 부서 선택 핸들러
  const handleArchiveDepartmentSelect = useCallback((departmentName: string): void => {
    setSelectedDepartment(departmentName);
    setSelectedFileType('all');
  }, []);

  // 파일 타입 선택 핸들러
  const handleFileTypeSelect = useCallback((fileType: '전체' | '문서' | '이미지' | '음성'): void => {
    const fileTypeMap: Record<string, 'document' | 'image' | 'audio' | 'all'> = {
      '전체': 'all',
      '문서': 'document', 
      '이미지': 'image',
      '음성': 'audio'
    };
    setSelectedFileType(fileTypeMap[fileType]);
  }, []);

  // 전체 선택 핸들러
  const handleAllSelect = useCallback((): void => {
    setSelectedDepartment('전체 파일');
    setSelectedFileType('all');
    setIsArchiveMode(false);
  }, []);

  // 보관함 선택 핸들러
  const handleArchiveSelect = useCallback((): void => {
    setIsArchiveMode(true);
    setSelectedDepartment('전체 파일');
    setSelectedFileType('all');
  }, []);

  // 보관함 닫기 핸들러
  const handleArchiveClose = useCallback((): void => {
    setIsArchiveClose(true);
    setTimeout(() => {
      setIsArchiveMode(false);
      setIsArchiveClose(false);
    }, 400);
  }, []);

  // 모달 핸들러들
  const openUploadModal = useCallback((): void => {
    setIsMediaUploadModalOpen(true);
  }, []);

  const closeUploadModal = useCallback((): void => {
    setIsMediaUploadModalOpen(false);
    setIsEditMode(false);
    setEditInitialData(null);
  }, []);

  const openEditModal = useCallback((initialData: MediaUploadData): void => {
    setIsEditMode(true);
    setEditInitialData(initialData);
    setIsMediaUploadModalOpen(true);
  }, []);

  const openConfirmModal = useCallback((type: 'archive' | 'download', fileName: string): void => {
    setModalType(type);
    setSelectedFileName(fileName);
    setIsConfirmModalOpen(true);
  }, []);

  const closeConfirmModal = useCallback((): void => {
    setIsConfirmModalOpen(false);
    setSelectedFileName('');
  }, []);

  const openVersionModal = useCallback((fileName: string): void => {
    setSelectedFileName(fileName);
    setIsVersionModalOpen(true);
  }, []);

  const closeVersionModal = useCallback((): void => {
    setIsVersionModalOpen(false);
    setSelectedFileName('');
  }, []);

  return {
    filters: {
      selectedDepartment,
      selectedFileType,
      filteredFiles
    },
    
    archive: {
      isMode: isArchiveMode,
      isClosing: isArchiveClose,
      select: handleArchiveSelect,
      close: handleArchiveClose,
      selectDepartment: handleArchiveDepartmentSelect
    },
    
    modals: {
      uploadModal: {
        isOpen: isMediaUploadModalOpen,
        isEditMode,
        initialData: editInitialData,
        open: openUploadModal,
        openEdit: openEditModal,
        close: closeUploadModal
      },
      confirmModal: {
        isOpen: isConfirmModalOpen,
        type: modalType,
        fileName: selectedFileName,
        open: openConfirmModal,
        close: closeConfirmModal
      },
      versionModal: {
        isOpen: isVersionModalOpen,
        fileName: selectedFileName,
        open: openVersionModal,
        close: closeVersionModal
      }
    },
    
    actions: {
      setSelectedFileName,
      handleDepartmentSelect,
      handleFileTypeSelect,
      handleAllSelect
    }
  };
};
