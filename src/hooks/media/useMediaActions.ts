import { useCallback } from 'react';
import { useFileUpload, useFileUpdate, useFileArchive } from '@/query/useMediaMutations';
import { useMediaStore } from '@/store/mediaStore';
import type { MediaUploadData } from '@/types/media';

export const useMediaActions = () => {
  const uploadMutation = useFileUpload();
  const updateMutation = useFileUpdate();
  const archiveMutation = useFileArchive();
  const { selectedFile, setSelectedFile } = useMediaStore();

  // 파일 업로드 핸들러
  const handleUpload = useCallback(async (data: MediaUploadData, onSuccess?: () => void, onError?: (message: string) => void) => {
    if (!data.uploadFile) {
      console.error('업로드할 파일이 없습니다.');
      onError?.('업로드할 파일이 없습니다.');
      return;
    }
    
    try {
      await uploadMutation.mutateAsync({ file: data.uploadFile, fileInfo: data });
      console.log('파일 업로드 성공');
      onSuccess?.();
    } catch (error: unknown) {
      const axiosError = error as { 
        response?: { 
          status?: number; 
          data?: { message?: string }; 
        }; 
      };
      console.error('파일 업로드 실패:', error);
      
      // 에러 타입에 따른 메시지 처리
      let errorMessage = '파일 업로드 중 오류가 발생했습니다.';
      
      if (axiosError.response?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요.';
      } else if (axiosError.response?.status === 413) {
        errorMessage = '파일 크기가 너무 큽니다. 더 작은 파일을 선택해주세요.';
      } else if (axiosError.response?.status === 415) {
        errorMessage = '지원하지 않는 파일 형식입니다.';
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }
      
      onError?.(errorMessage);
    }
  }, [uploadMutation]);

  // 파일 수정 핸들러
  const handleEdit = useCallback(async (data: MediaUploadData, onSuccess?: () => void, onError?: (message: string) => void) => {
    if (!selectedFile?.fileId) {
      console.error('수정할 파일이 선택되지 않았습니다.');
      onError?.('수정할 파일이 선택되지 않았습니다.');
      return;
    }
    
    try {
      await updateMutation.mutateAsync({ 
        fileId: selectedFile.fileId, 
        file: data.uploadFile || null, 
        fileInfo: data 
      });
      console.log('파일 수정 성공');
      // 수정 완료 후 선택된 파일 정보 초기화
      setSelectedFile(null);
      onSuccess?.();
    } catch (error: unknown) {
      const axiosError = error as { 
        response?: { 
          status?: number; 
          data?: { message?: string }; 
        }; 
      };
      console.error('파일 수정 실패:', error);
      
      // 에러 타입에 따른 메시지 처리
      let errorMessage = '파일 수정 중 오류가 발생했습니다.';
      
      if (axiosError.response?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요.';
      } else if (axiosError.response?.status === 409) {
        errorMessage = '기존 파일 버전과 같거나 낮은 버전으로 업데이트할 수 없습니다.';
      } else if (axiosError.response?.status === 413) {
        errorMessage = '파일 크기가 너무 큽니다. 더 작은 파일을 선택해주세요.';
      } else if (axiosError.response?.status === 415) {
        errorMessage = '지원하지 않는 파일 형식입니다.';
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }
      
      onError?.(errorMessage);
    }
  }, [updateMutation, selectedFile, setSelectedFile]);

  // 파일 보관 핸들러
  const handleArchive = useCallback(async (fileId: number, onSuccess?: () => void) => {
    try {
      await archiveMutation.mutateAsync(fileId);
      console.log('파일 보관 성공');
      onSuccess?.();
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
