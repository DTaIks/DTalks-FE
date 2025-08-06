import { useCallback } from 'react';
import type { MediaFile } from '@/hooks/media/useMediaFile';

interface UseMediaHandlersProps {
  modals: {
    confirmModal: {
      open: (type: 'archive' | 'download', fileName: string) => void;
    };
    uploadModal: {
      openEdit: (initialData: { fileName: string; description: string; fileVersion: string; isPublic: boolean }) => void;
      isEditMode: boolean;
      close: () => void;
    };
  };
  mediaActions: {
    handleConfirmAction: (modalType: 'archive' | 'download', fileName: string) => void;
    handleEdit: (data: { fileName: string; description: string; fileVersion: string; isPublic: boolean }) => void;
    handleUpload: (data: { fileName: string; description: string; fileVersion: string; isPublic: boolean }) => void;
  };
}

export const useMediaHandlers = ({ modals, mediaActions }: UseMediaHandlersProps) => {
  // 다운로드 버튼 클릭 핸들러
  const handleDownloadClick = useCallback((fileName: string) => {
    modals.confirmModal.open('download', fileName);
  }, [modals.confirmModal]);

  // 보관 버튼 클릭 핸들러
  const handleArchiveClick = useCallback((fileName: string) => {
    modals.confirmModal.open('archive', fileName);
  }, [modals.confirmModal]);

  // 수정 버튼 클릭 핸들러
  const handleEditClick = useCallback((file: MediaFile) => {
    const initialData = {
      fileName: file.fileName,
      description: file.description || '',
      fileVersion: file.fileVersion || '1.0.0',
      isPublic: file.isPublic || false
    };
    modals.uploadModal.openEdit(initialData);
  }, [modals.uploadModal]);

  // 확인 모달 액션 핸들러
  const handleConfirmAction = useCallback(() => {
    // 이 함수는 MediaPage에서 직접 구현되어야 함
    // 여기서는 placeholder로만 제공
  }, []);

  // 업로드 모달 핸들러
  const handleUploadSubmit = useCallback((data: { fileName: string; description: string; fileVersion: string; isPublic: boolean }) => {
    if (modals.uploadModal.isEditMode) {
      mediaActions.handleEdit(data);
    } else {
      mediaActions.handleUpload(data);
    }
    modals.uploadModal.close();
  }, [modals.uploadModal, mediaActions]);

  return {
    handleDownloadClick,
    handleArchiveClick,
    handleEditClick,
    handleConfirmAction,
    handleUploadSubmit
  };
};
