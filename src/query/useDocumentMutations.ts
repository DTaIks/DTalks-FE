import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentAPI } from '@/api/documentAPI';

// 에러 타입 정의
interface ApiError extends Error {
  code?: string;
  response?: {
    status?: number;
    statusText?: string;
    data?: unknown;
  };
  config?: unknown;
}

// 문서 업로드 정보 타입
interface DocumentUploadInfo {
  fileName: string;
  description: string;
  fileVersion: string;
  category: string;
}

// 문서 수정 정보 타입
interface DocumentUpdateInfo {
  fileId: number;
  file: File | null;
  fileInfo: DocumentUploadInfo;
}

// 문서 업로드 뮤테이션
export const useDocumentUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, fileInfo }: { file: File; fileInfo: DocumentUploadInfo }) =>
      documentAPI.uploadDocument(file, fileInfo),
    onSuccess: () => {
      // 모든 문서 관련 쿼리를 무효화 (미디어와 동일한 방식)
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          query.queryKey[0] === 'documentList' || 
          query.queryKey[0] === 'documentAllList' ||
          query.queryKey[0] === 'documentCount'
      });
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      console.error('문서 업로드 실패:', error);
      console.error('에러 상세 정보:', {
        message: error.message,
        code: apiError.code,
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data,
        config: apiError.config
      });
      
      // 서버 응답 데이터가 있다면 출력
      if (apiError.response?.data) {
        console.error('서버 응답 데이터:', apiError.response.data);
      }
    },
  });
};

// 문서 수정 뮤테이션
export const useDocumentUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileId, file, fileInfo }: DocumentUpdateInfo) =>
      documentAPI.updateDocument(fileId, file, fileInfo),
    onSuccess: () => {
      // 모든 문서 관련 쿼리를 무효화
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          query.queryKey[0] === 'documentList' || 
          query.queryKey[0] === 'documentAllList' ||
          query.queryKey[0] === 'documentCount'
      });
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      console.error('문서 수정 실패:', error);
      console.error('에러 상세 정보:', {
        message: error.message,
        code: apiError.code,
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data,
        config: apiError.config
      });
      
      // 서버 응답 데이터가 있다면 출력
      if (apiError.response?.data) {
        console.error('서버 응답 데이터:', apiError.response.data);
      }
    },
  });
};

// 문서 보관 뮤테이션
export const useDocumentArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: number) => documentAPI.archiveDocument(fileId),
    onSuccess: () => {
      // 모든 문서 관련 쿼리를 무효화
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          query.queryKey[0] === 'documentList' || 
          query.queryKey[0] === 'documentAllList' ||
          query.queryKey[0] === 'documentCount'
      });
    },
    onError: (error: Error) => {
      console.error('문서 보관 실패:', error);
    },
  });
};

// 문서 복원 뮤테이션
export const useDocumentRestore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: number) => documentAPI.restoreDocument(fileId),
    onSuccess: () => {
      // 모든 문서 관련 쿼리를 무효화
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          query.queryKey[0] === 'documentList' || 
          query.queryKey[0] === 'documentAllList' ||
          query.queryKey[0] === 'documentCount'
      });
    },
    onError: (error: Error) => {
      console.error('문서 복원 실패:', error);
    },
  });
};