import { useCallback } from 'react';
import { useFileUpload, useFileUpdate, useFileArchive } from '@/query/useMediaMutations';
import { useMediaStore } from '@/store/mediaStore';
import type { MediaUploadData } from '@/types/media';

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
    } catch (error: unknown) {
      console.error('파일 업로드 실패:', error);
      // 에러를 다시 throw해서 부모 컴포넌트에서 처리할 수 있도록 함
      throw error;
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
    } catch (error: unknown) {
      console.error('파일 수정 실패:', error);
      // 에러를 다시 throw해서 부모 컴포넌트에서 처리할 수 있도록 함
      throw error;
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

  return {
    handleUpload,
    handleEdit,
    handleArchive,
  };
};
