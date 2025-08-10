import { useCallback } from 'react';
import type { MediaFile } from '@/hooks/media/useMediaFile';
import { useDocumentStore } from '@/store/documentStore';

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
  const { archiveDocumentItem } = useDocumentStore();
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

    // 파일명에서 버전 추출 시도 (예: filename_v1.0.0.pdf)
    const versionMatch = file.fileName.match(/v(\d+\.\d+\.\d+)/);
    const extractedVersion = versionMatch ? versionMatch[1] : '1.0.0';

    const initialData = {
      fileName: file.fileName,
      description: file.description || `${file.fileName} 파일입니다.`,
      fileVersion: file.fileVersion || extractedVersion,
      isPublic: file.isPublic ?? true // 기본값을 true로 설정
    };
    
    console.log('수정 모달 초기 데이터:', initialData);
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

  // 파일명으로 문서를 찾아서 보관하는 핸들러 (공통)
  const handleArchiveByFileName = useCallback((fileName: string) => {
    // 파일명으로 문서를 찾아서 보관 처리
    const documentToArchive = useDocumentStore.getState().documentItems.find(
      doc => doc.documentName === fileName
    );
    
    if (documentToArchive) {
      archiveDocumentItem(documentToArchive.documentId);
    }
  }, [archiveDocumentItem]);

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
    handleArchiveByFileName,
    handleVersionHistoryClick
  };
};
