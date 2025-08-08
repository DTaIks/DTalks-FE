import { useState, useCallback } from 'react';
import type { DocumentUploadData } from '@/components/common/DocumentUploadModal';

interface FileUploadModalState {
  isOpen: boolean;
  isEditMode: boolean;
  initialData?: DocumentUploadData;
}

interface ConfirmModalState {
  isOpen: boolean;
  modalType: 'archive' | 'download';
  selectedFileName: string;
}

interface UseFileUploadProps {
  onUpload?: (data: DocumentUploadData) => void;
  onEdit?: (data: DocumentUploadData) => void;
  onArchive?: (fileName: string) => void;
  onDownload?: (fileName: string) => void;
  pageType: 'policy' | 'report' | 'glossary';
}

export const useFileUpload = ({ onUpload, onEdit, onArchive, onDownload, pageType }: UseFileUploadProps) => {
  const [uploadModal, setUploadModal] = useState<FileUploadModalState>({
    isOpen: false,
    isEditMode: false
  });

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    modalType: 'download',
    selectedFileName: ''
  });

  // 파일 업로드 버튼 클릭 핸들러
  const handleFileUploadClick = useCallback(() => {
    setUploadModal({
      isOpen: true,
      isEditMode: false
    });
  }, []);

  // 파일 수정 버튼 클릭 핸들러
  const handleFileEditClick = useCallback((fileData: DocumentUploadData) => {
    setUploadModal({
      isOpen: true,
      isEditMode: true,
      initialData: fileData
    });
  }, []);

  // 업로드 모달 닫기 핸들러
  const handleCloseUploadModal = useCallback(() => {
    setUploadModal({
      isOpen: false,
      isEditMode: false
    });
  }, []);

  // 파일 업로드/수정 제출 핸들러
  const handleSubmit = useCallback((data: DocumentUploadData) => {
    if (uploadModal.isEditMode) {
      onEdit?.(data);
    } else {
      onUpload?.(data);
    }
    handleCloseUploadModal();
  }, [uploadModal.isEditMode, onUpload, onEdit, handleCloseUploadModal]);

  // 확인 모달 열기 핸들러
  const openConfirmModal = useCallback((type: 'archive' | 'download', fileName: string) => {
    setConfirmModal({
      isOpen: true,
      modalType: type,
      selectedFileName: fileName
    });
  }, []);

  // 확인 모달 닫기 핸들러
  const closeConfirmModal = useCallback(() => {
    setConfirmModal({
      isOpen: false,
      modalType: 'download',
      selectedFileName: ''
    });
  }, []);

  // 확인 모달 액션 핸들러
  const handleConfirmAction = useCallback(() => {
    if (confirmModal.modalType === 'archive') {
      onArchive?.(confirmModal.selectedFileName);
    } else if (confirmModal.modalType === 'download') {
      onDownload?.(confirmModal.selectedFileName);
    }
    closeConfirmModal();
  }, [confirmModal, onArchive, onDownload, closeConfirmModal]);

  // 페이지별 버튼 텍스트
  const getButtonText = useCallback(() => {
    switch (pageType) {
      case 'policy':
        return '파일 업로드';
      case 'report':
        return '파일 업로드';
      case 'glossary':
        return '파일 업로드';
      default:
        return '파일 업로드';
    }
  }, [pageType]);

  // 페이지별 제목
  const getModalTitle = useCallback(() => {
    switch (pageType) {
      case 'policy':
        return '사내 정책 파일 업로드';
      case 'report':
        return '보고서 양식 파일 업로드';
      case 'glossary':
        return '용어 사전 파일 업로드';
      default:
        return '파일 업로드';
    }
  }, [pageType]);

  // 모달 객체 (테이블에서 사용)
  const modals = {
    confirmModal: {
      open: openConfirmModal,
      close: closeConfirmModal
    }
  };

  return {
    // 상태
    uploadModal,
    confirmModal,
    
    // 핸들러
    handleFileUploadClick,
    handleFileEditClick,
    handleCloseUploadModal,
    handleSubmit,
    openConfirmModal,
    closeConfirmModal,
    handleConfirmAction,
    
    // 모달 객체
    modals,
    
    // 유틸리티
    getButtonText,
    getModalTitle
  };
};
