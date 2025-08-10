import { useCallback } from 'react';
import { useArchivedFilesStore } from '@/store/archivedFileStore';
import { type MediaUploadData } from '@/components/admin/media/MediaFileUploadModal';
import { useFileUpload } from '@/query/useMediaMutations';

export const useMediaActions = () => {
  const { archiveFile } = useArchivedFilesStore();
  const uploadMutation = useFileUpload();

  // 파일 업로드 핸들러
  const handleUpload = useCallback((data: MediaUploadData): void => {
    if (!data.uploadFile) {
      alert('업로드할 파일을 선택해주세요.');
      return;
    }

    const fileInfo = {
      fileName: data.fileName,
      description: data.description,
      fileVersion: data.fileVersion,
      isPublic: data.isPublic
    };

    uploadMutation.mutate(
      { file: data.uploadFile, fileInfo },
      {
        onSuccess: (response) => {
          console.log('파일 업로드 성공:', response);
          // alert 제거 - 성공 시 조용히 처리
        },
        onError: (error) => {
          console.error('파일 업로드 실패:', error);
          alert('파일 업로드에 실패했습니다. 다시 시도해주세요.');
        }
      }
    );
  }, [uploadMutation]);

  // 파일 수정 핸들러
  const handleEdit = useCallback((data: MediaUploadData): void => {
    console.log('미디어 파일 수정 데이터:', data);
    alert(`미디어 파일 "${data.fileName}"이 수정되었습니다!`);
  }, []);

  // 파일 다운로드 핸들러
  const handleDownload = useCallback((fileName: string): void => {
    alert(`${fileName} 다운로드를 시작합니다.`);
  }, []);

  // 파일 보관 핸들러
  const handleArchive = useCallback((fileName: string): void => {
    // API에서 파일 ID를 가져오는 로직으로 변경 예정
    // 현재는 임시로 파일명을 기반으로 보관 처리
    const tempFileId = Date.now(); // 임시 파일 ID
    archiveFile(tempFileId);
    alert(`${fileName}을 보관합니다.`);
  }, [archiveFile]);

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
    handleEdit,
    handleDownload,
    handleArchive,
    handleConfirmAction
  };
};
