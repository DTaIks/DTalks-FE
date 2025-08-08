import { useCallback } from 'react';
import type { MediaFile } from '@/hooks/media/useMediaFile';

interface UseCommonHandlersProps {
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
    uploadModal?: {
      openEdit: (initialData: { fileName: string; description: string; fileVersion: string; isPublic: boolean }) => void;
      isEditMode: boolean;
      close: () => void;
    };
    versionModal?: {  
      open: (fileName: string) => void;
      close: () => void;
      isOpen: boolean;
    }
  };
  mediaActions?: {
    handleConfirmAction: (modalType: 'archive' | 'download', fileName: string) => void;
    handleEdit: (data: { fileName: string; description: string; fileVersion: string; isPublic: boolean }) => void;
    handleUpload: (data: { fileName: string; description: string; fileVersion: string; isPublic: boolean }) => void;
  };
  documentActions?: {
    onArchive: (id: number) => void;
  };
}

export const useCommonHandlers = ({ modals, mediaActions, documentActions }: UseCommonHandlersProps) => {
  // 다운로드 버튼 클릭 핸들러 (공통)
  const handleDownloadClick = useCallback((fileName: string) => {
    modals.confirmModal.open('download', fileName);
  }, [modals.confirmModal]);

  // 보관 버튼 클릭 핸들러 (공통)
  const handleArchiveClick = useCallback((fileName: string) => {
    modals.confirmModal.open('archive', fileName);
  }, [modals.confirmModal]);

  // 버전관리 버튼 클릭 핸들러 (공통)
  const handleVersionManagementClick = useCallback((fileName: string) => {
    modals.versionModal?.open(fileName);  
  }, [modals.versionModal]); 

  // 수정 버튼 클릭 핸들러 (Media 전용)
  const handleEditClick = useCallback((file: MediaFile) => {
    if (!modals.uploadModal || !mediaActions) {
      console.log("수정 기능은 Media 페이지에서만 사용 가능합니다.");
      return;
    }

    const initialData = {
      fileName: file.fileName,
      description: file.description || '',
      fileVersion: file.fileVersion || '1.0.0',
      isPublic: file.isPublic || false
    };
    modals.uploadModal.openEdit(initialData);
  }, [modals.uploadModal, mediaActions]);

  // 확인 모달 액션 핸들러 (공통)
  const handleConfirmAction = useCallback(() => {
    // 이 함수는 각 페이지에서 직접 구현되어야 함
    // 여기서는 placeholder로만 제공
  }, []);

  // 업로드 모달 핸들러 (Media 전용)
  const handleUploadSubmit = useCallback((data: { fileName: string; description: string; fileVersion: string; isPublic: boolean }) => {
    if (!modals.uploadModal || !mediaActions) {
      console.log("업로드 기능은 Media 페이지에서만 사용 가능합니다.");
      return;
    }

    if (modals.uploadModal.isEditMode) {
      mediaActions.handleEdit(data);
    } else {
      mediaActions.handleUpload(data);
    }
    modals.uploadModal.close();
  }, [modals.uploadModal, mediaActions]);

  // Document 보관 핸들러 (Document 전용)
  const handleDocumentArchive = useCallback((documentId: number) => {
    if (!documentActions) {
      console.log("보관 기능은 Document 페이지에서만 사용 가능합니다.");
      return;
    }
    documentActions.onArchive(documentId);
  }, [documentActions]);

  return {
    // 공통 핸들러
    handleDownloadClick,
    handleArchiveClick,
    handleVersionManagementClick,
    handleConfirmAction,
    
    // Media 전용 핸들러
    handleEditClick,
    handleUploadSubmit,
    
    // Document 전용 핸들러
    handleDocumentArchive
  };
};
