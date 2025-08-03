import { useCallback } from 'react';
import { useFiles } from './useMediaFile'
import { useArchivedFilesStore } from '../../store/archivedFileStore';
import { type MediaUploadData } from '../../components/admin/media/MediaFileUploadModal';

export const useMediaActions = () => {
  const files = useFiles();
  const { archiveFile } = useArchivedFilesStore();

  // 파일 업로드 핸들러
  const handleUpload = useCallback((data: MediaUploadData): void => {
    console.log('미디어 파일 업로드 데이터:', data);
    alert(`미디어 파일 "${data.fileName}"이 업로드되었습니다!`);
  }, []);

  // 파일 다운로드 핸들러
  const handleDownload = useCallback((fileName: string): void => {
    alert(`${fileName} 다운로드를 시작합니다.`);
  }, []);

  // 파일 보관 핸들러
  const handleArchive = useCallback((fileName: string): void => {
    const selectedFile = files.find(file => file.fileName === fileName);
    
    if (!selectedFile) {
      return;
    }

    archiveFile(selectedFile.fileId);
    alert(`${fileName}을 보관합니다.`);
  }, [files, archiveFile]);

  // Comfirm 모달에서 사용할 액션 핸들러
  const handleConfirmAction = useCallback((
    modalType: 'archive' | 'download',
    fileName: string
  ): void => {
    if (modalType === 'download') {
      handleDownload(fileName);
    } else if (modalType === 'archive') {
      handleArchive(fileName);
    }
  }, [handleDownload, handleArchive]);

  return {
    handleUpload,
    handleDownload,
    handleArchive,
    handleConfirmAction
  };
};
