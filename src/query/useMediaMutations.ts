import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaAPI } from '@/api/mediaAPI';
import type { FileUploadInfo } from '@/types/media';
import type { MediaUploadData } from '@/types/modal';

// 파일 업로드 뮤테이션
export const useFileUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, fileInfo }: { file: File; fileInfo: FileUploadInfo | MediaUploadData }) =>
      mediaAPI.uploadFile(file, fileInfo),
    onSuccess: () => {
      // 모든 미디어 관련 쿼리를 무효화
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          query.queryKey[0] === 'mediaFiles' || 
          query.queryKey[0] === 'departmentFiles' ||
          query.queryKey[0] === 'archivedFiles' ||
          query.queryKey[0] === 'departmentArchivedFiles'
      });
    },
    onError: (error: Error) => {
      console.error('파일 업로드 실패:', error);
    },
  });
};

// 파일 수정 뮤테이션
export const useFileUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileId, file, fileInfo }: { fileId: number; file: File | null; fileInfo: FileUploadInfo | MediaUploadData }) =>
      mediaAPI.updateFile(fileId, file, fileInfo),
    onSuccess: () => {
      // 모든 미디어 관련 쿼리를 무효화
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'mediaFiles' || 
          query.queryKey[0] === 'departmentFiles' ||
          query.queryKey[0] === 'archivedFiles' ||
          query.queryKey[0] === 'departmentArchivedFiles'
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
      // 모든 미디어 관련 쿼리를 무효화
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'mediaFiles' || 
          query.queryKey[0] === 'departmentFiles' ||
          query.queryKey[0] === 'archivedFiles' ||
          query.queryKey[0] === 'departmentArchivedFiles'
      });
    },
    onError: (error: Error) => {
      console.error('파일 보관 실패:', error);
    },
  });
};
