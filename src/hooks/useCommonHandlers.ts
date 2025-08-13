import { useCallback } from 'react';
import type { MediaFile } from '@/types/media';

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
      open: (fileName: string, fileId?: number) => void;
      close: () => void;
      isOpen: boolean;
    }
  };
  mediaActions?: {
    handleConfirmAction: (modalType: 'archive' | 'download', fileName: string) => void;
    handleEdit: (data: { fileName: string; description: string; fileVersion: string; isPublic: boolean }) => void;
    handleUpload: (data: { fileName: string; description: string; fileVersion: string; isPublic: boolean }) => void;
    setSelectedFile?: (file: { fileId: number; fileName: string } | null) => void;
  };
  documentActions?: {
    onArchive: (id: number) => void;
    onUpdate?: (documentName: string) => void;
  };
}

export const useCommonHandlers = ({ modals, mediaActions, documentActions }: UseCommonHandlersProps) => {
  // const { archiveDocumentItem } = useDocumentStore();
  // 다운로드 버튼 클릭 핸들러 (공통)
  const handleDownloadClick = useCallback((fileName: string, fileUrl?: string) => {
    if (fileUrl) {
      // fileUrl이 있으면 유효성 검사 후 다운로드
      fetch(fileUrl, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            // 파일이 존재하면 다운로드
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            // 파일이 존재하지 않으면 에러 메시지 표시
            alert('파일을 찾을 수 없습니다. 관리자에게 문의해주세요.');
          }
        })
        .catch(() => {
          alert('파일 다운로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        });
    } else {
      // fileUrl이 없으면 확인 모달 표시
      modals.confirmModal.open('download', fileName);
    }
  }, [modals.confirmModal]);

  // 보관 버튼 클릭 핸들러 (공통)
  const handleArchiveClick = useCallback((fileName: string) => {
    modals.confirmModal.open('archive', fileName);
  }, [modals.confirmModal]);

  // 버전관리 버튼 클릭 핸들러 (공통)
  const handleVersionManagementClick = useCallback((fileName: string, fileId?: number) => {
    modals.versionModal?.open(fileName, fileId);  
  }, [modals.versionModal]); 

  // 수정 버튼 클릭 핸들러 (Media 전용)
  const handleEditClick = useCallback((file: MediaFile) => {
    if (!modals.uploadModal || !mediaActions) {
      return;
    }

    // 선택된 파일 정보 저장
    if (mediaActions.setSelectedFile) {
      mediaActions.setSelectedFile({
        fileId: file.fileId,
        fileName: file.fileName
      });
    }

    const initialData = {
      uploadFile: undefined, // 수정 모드에서는 기존 파일 유지 (새 파일 선택 시에만 변경)
      fileName: file.fileName,
      description: file.description || '',
      fileVersion: file.fileVersion || '1.0.0', // 기존 버전 그대로 사용
      isPublic: file.isPublic ?? true // 기본값을 true로 설정
    };
    
    modals.uploadModal.openEdit(initialData);
  }, [modals.uploadModal, mediaActions]);

  // 문서 수정 버튼 클릭 핸들러 (Document 전용)
  const handleDocumentUpdateClick = useCallback((documentName: string) => {
    if (documentActions?.onUpdate) {
      documentActions.onUpdate(documentName);
    }
  }, [documentActions]);

  // 확인 모달 액션 핸들러 (공통)
  const handleConfirmAction = useCallback(() => {
    // 이 함수는 각 페이지에서 직접 구현되어야 함
    // 여기서는 placeholder로만 제공
  }, []);

  // 업로드 모달 핸들러 (Media 전용)
  const handleUploadSubmit = useCallback((data: { fileName: string; description: string; fileVersion: string; isPublic: boolean }) => {
    if (!modals.uploadModal || !mediaActions) {
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
      return;
    }
    documentActions.onArchive(documentId);
  }, [documentActions]);

  // 파일명으로 문서를 찾아서 보관하는 핸들러 (공통)
  const handleArchiveByFileName = useCallback((fileName: string) => {
    // React Query로 데이터 관리하므로 직접 confirmModal 열기
    modals.confirmModal.open('archive', fileName);
  }, [modals.confirmModal]);

  // 버전 히스토리 모달 핸들러 (공통)
  const handleVersionHistoryClick = useCallback((fileName: string) => {
    if (modals.versionModal) {
      modals.versionModal.open(fileName);
    }
  }, [modals.versionModal]);

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
    handleDocumentArchive,
    handleDocumentUpdateClick,
    handleArchiveByFileName,
    handleVersionHistoryClick
  };
};
