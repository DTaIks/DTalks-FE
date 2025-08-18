import { useState, useCallback } from "react";
import type { DocumentInfo } from "@/types/document";

// 모달 상태 타입 정의
interface ConfirmModalState {
  isOpen: boolean;
  type: 'archive' | 'download' | 'restore';
  fileName: string;
}

interface VersionModalState {
  isOpen: boolean;
  fileName: string;
  fileId: number | null;
}

interface UpdateModalState {
  isOpen: boolean;
  documentName: string;
  initialData?: {
    fileId?: number;
    fileName: string;
    description: string;
    fileVersion: string;
    category: string;
    fileUrl?: string;
  };
}

// 모달 관리 훅
export const useDocumentAllModals = (documents: DocumentInfo[]) => {
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ 
    isOpen: false, 
    type: 'archive', 
    fileName: '' 
  });

  const [versionModal, setVersionModal] = useState<VersionModalState>({ 
    isOpen: false, 
    fileName: '',
    fileId: null
  });

  const [updateModal, setUpdateModal] = useState<UpdateModalState>({ 
    isOpen: false, 
    documentName: '', 
    initialData: undefined
  });

  // 확인 모달 핸들러
  const openConfirmModal = useCallback((type: 'archive' | 'download' | 'restore', fileName: string) => {
    setConfirmModal({ isOpen: true, type, fileName });
  }, []);
  
  const closeConfirmModal = useCallback(() => {
    setConfirmModal({ isOpen: false, type: 'archive', fileName: '' });
  }, []);

  // 버전 모달 핸들러
  const openVersionModal = useCallback((fileName: string) => {
    const document = documents.find(doc => doc.documentName === fileName);
    if (document) {
      setVersionModal({ isOpen: true, fileName, fileId: document.documentId });
    }
  }, [documents]);
  
  const closeVersionModal = useCallback(() => {
    setVersionModal({ isOpen: false, fileName: '', fileId: null });
  }, []);

  // 업데이트 모달 핸들러
  const openUpdateModal = useCallback((documentName: string) => {
    const documentToUpdate = documents.find(doc => doc.documentName === documentName);
    if (documentToUpdate) {
      setUpdateModal({
        isOpen: true,
        documentName,
        initialData: {
          fileId: documentToUpdate.documentId,
          fileName: documentToUpdate.documentName,
          description: '',
          fileVersion: documentToUpdate.latestVersion || '1.0.0',
          category: documentToUpdate.category,
          fileUrl: documentToUpdate.fileUrl
        }
      });
    }
  }, [documents]);
  
  const closeUpdateModal = useCallback(() => {
    setUpdateModal({ isOpen: false, documentName: '', initialData: undefined });
  }, []);

  return {
    // 상태
    confirmModal,
    versionModal,
    updateModal,
    
    // 핸들러
    openConfirmModal,
    closeConfirmModal,
    openVersionModal,
    closeVersionModal,
    openUpdateModal,
    closeUpdateModal,
  };
};
