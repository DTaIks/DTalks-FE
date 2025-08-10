import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaAPI } from '@/api/mediaAPI';
import type { FileUploadInfo } from '@/types/media';

// 파일 업로드 뮤테이션
export const useFileUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, fileInfo }: { file: File; fileInfo: FileUploadInfo }) =>
      mediaAPI.uploadFile(file, fileInfo),
    onSuccess: () => {
      // 모든 mediaFiles와 departmentFiles 쿼리를 무효화
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          query.queryKey[0] === 'mediaFiles' || query.queryKey[0] === 'departmentFiles'
      });
    },
    onError: (error: Error) => {
      console.error('파일 업로드 실패:', error);
      console.error('에러 상세 정보:', {
        message: error.message,
        code: (error as { code?: string }).code,
        status: (error as { response?: { status?: number } }).response?.status,
        statusText: (error as { response?: { statusText?: string } }).response?.statusText,
        data: (error as { response?: { data?: unknown } }).response?.data,
        config: (error as { config?: unknown }).config
      });
    },
  });
};

// 파일 수정 뮤테이션
export const useFileUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileId, file, fileInfo }: { fileId: number; file: File | null; fileInfo: FileUploadInfo }) =>
      mediaAPI.updateFile(fileId, file, fileInfo),
    onSuccess: () => {
      // 모든 mediaFiles와 departmentFiles 쿼리를 무효화
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'mediaFiles' || query.queryKey[0] === 'departmentFiles'
      });
    },
    onError: (error: Error) => {
      console.error('파일 수정 실패:', error);
    },
  });
};

// 파일 보관 뮤테이션
export const useFileArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: number) => mediaAPI.archiveFile(fileId),
    onSuccess: () => {
      // 모든 mediaFiles와 departmentFiles 쿼리를 무효화
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'mediaFiles' || query.queryKey[0] === 'departmentFiles'
      });
    },
    onError: (error: Error) => {
      console.error('파일 보관 실패:', error);
    },
  });
};
