import { useCallback } from 'react';
import { useFileUpload, useFileUpdate, useFileArchive } from '@/query/useMediaMutations';
import { useMediaStore } from '@/store/mediaStore';
import type { MediaUploadData } from '@/components/admin/media/MediaFileUploadModal';

export const useMediaActions = () => {
  const uploadMutation = useFileUpload();
  const updateMutation = useFileUpdate();
  const archiveMutation = useFileArchive();
  const { selectedFile } = useMediaStore();

  // 파일 업로드 핸들러
  const handleUpload = useCallback(async (data: MediaUploadData) => {
    if (!data.uploadFile) {
      console.error('업로드할 파일이 없습니다.');
      return;
    }
    
    try {
      await uploadMutation.mutateAsync({ file: data.uploadFile, fileInfo: data });
    } catch (error) {
      console.error('파일 업로드 실패:', error);
    }
  }, [uploadMutation]);

  // 파일 수정 핸들러
  const handleEdit = useCallback(async (data: MediaUploadData) => {
    if (!selectedFile?.fileId) {
      console.error('수정할 파일이 선택되지 않았습니다.');
      return;
    }
    
    try {
      await updateMutation.mutateAsync({ 
        fileId: selectedFile.fileId, 
        file: data.uploadFile || null, 
        fileInfo: data 
      });
    } catch (error) {
      console.error('파일 수정 실패:', error);
    }
  }, [updateMutation, selectedFile]);

  // 파일 보관 핸들러
  const handleArchive = useCallback(async (fileId: number) => {
    try {
      await archiveMutation.mutateAsync(fileId);
    } catch (error) {
      console.error('파일 보관 실패:', error);
    }
  }, [archiveMutation]);

  // 확인 모달 액션 핸들러
  const handleConfirmAction = useCallback((modalType: 'archive' | 'download', fileName: string) => {
    if (modalType === 'archive') {
      // 보관 처리 로직 - 파일명으로 파일 ID를 찾아서 보관 처리
      // 실제 구현에서는 파일명으로 파일 ID를 찾는 로직이 필요합니다
      console.log('파일 보관:', fileName);
    } else if (modalType === 'download') {
      // 다운로드 처리 로직
      console.log('파일 다운로드:', fileName);
    }
  }, []);

  return {
    handleUpload,
    handleEdit,
    handleArchive,
    handleConfirmAction,
  };
};
