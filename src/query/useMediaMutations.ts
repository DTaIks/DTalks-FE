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
      // 모든 미디어 관련 쿼리를 무효화하고 즉시 리페치
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          query.queryKey[0] === 'mediaFiles' || 
          query.queryKey[0] === 'departmentFiles' ||
          query.queryKey[0] === 'archivedFiles' ||
          query.queryKey[0] === 'departmentArchivedFiles'
      });
      
      // 즉시 리페치를 위해 refetch 실행
      queryClient.refetchQueries({
        predicate: (query) => 
          query.queryKey[0] === 'mediaFiles' || 
          query.queryKey[0] === 'departmentFiles' ||
          query.queryKey[0] === 'archivedFiles' ||
          query.queryKey[0] === 'departmentArchivedFiles'
      });
    },
    onError: (error: Error) => {
      console.error('파일 업로드 뮤테이션 실패:', error);
      console.error('에러 상세 정보:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      // AxiosError인 경우 추가 정보 출력
      if ('response' in error) {
        const axiosError = error as { 
          response?: { 
            status?: number; 
            statusText?: string; 
            data?: unknown; 
          }; 
          config?: { 
            url?: string; 
            method?: string; 
          }; 
        };
        console.error('Axios 에러 상세 정보:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          config: {
            url: axiosError.config?.url,
            method: axiosError.config?.method
          }
        });
      }
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
      // 모든 미디어 관련 쿼리를 무효화하고 즉시 리페치
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'mediaFiles' || 
          query.queryKey[0] === 'departmentFiles' ||
          query.queryKey[0] === 'archivedFiles' ||
          query.queryKey[0] === 'departmentArchivedFiles'
      });
      
      // 즉시 리페치를 위해 refetch 실행
      queryClient.refetchQueries({
        predicate: (query) =>
          query.queryKey[0] === 'mediaFiles' || 
          query.queryKey[0] === 'departmentFiles' ||
          query.queryKey[0] === 'archivedFiles' ||
          query.queryKey[0] === 'departmentArchivedFiles'
      });
    },
    onError: (error: Error) => {
      console.error('파일 수정 뮤테이션 실패:', error);
      console.error('에러 상세 정보:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      // AxiosError인 경우 추가 정보 출력
      if ('response' in error) {
        const axiosError = error as { 
          response?: { 
            status?: number; 
            statusText?: string; 
            data?: unknown; 
          }; 
          config?: { 
            url?: string; 
            method?: string; 
          }; 
        };
        console.error('Axios 에러 상세 정보:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          config: {
            url: axiosError.config?.url,
            method: axiosError.config?.method
          }
        });
      }
    },
  });
};

// 파일 보관 뮤테이션
export const useFileArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: number) => mediaAPI.archiveFile(fileId),
    onSuccess: () => {
      // 모든 미디어 관련 쿼리를 무효화하고 즉시 리페치
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'mediaFiles' || 
          query.queryKey[0] === 'departmentFiles' ||
          query.queryKey[0] === 'archivedFiles' ||
          query.queryKey[0] === 'departmentArchivedFiles'
      });
      
      // 즉시 리페치를 위해 refetch 실행
      queryClient.refetchQueries({
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
