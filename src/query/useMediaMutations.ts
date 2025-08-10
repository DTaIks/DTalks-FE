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
      console.log('✅ 파일 업로드 성공! 쿼리 무효화 실행');
      // 파일 업로드 성공 시 파일 목록을 다시 불러옴
      queryClient.invalidateQueries({ queryKey: ['mediaFiles'] });
    },
    onError: (error: any) => {
      console.error('파일 업로드 실패:', error);
      console.error('에러 상세 정보:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
    },
  });
};
