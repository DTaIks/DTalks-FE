import { useQuery } from '@tanstack/react-query';
import { mediaAPI } from '@/api/mediaAPI';
import type { CommonFileRequest, DepartmentFileRequest, CommonArchivedFileRequest, DepartmentArchivedFileRequest, CommonFileResponse, CommonArchivedFileResponse } from '@/types/media';

// 공통 파일 목록 조회 쿼리
export const useMediaFiles = (params: CommonFileRequest, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['mediaFiles', params],
    queryFn: async () => {
      const result = await mediaAPI.getCommonFiles(params);
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 15, // 15분
    refetchOnMount: false, // 마운트 시 자동 리페치 비활성화
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
    refetchOnReconnect: false, // 재연결 시 자동 리페치 비활성화
    placeholderData: (previousData: CommonFileResponse | undefined) => previousData, // 이전 데이터를 placeholder로 사용
    enabled: options?.enabled !== false, // 기본값은 true
  });
};

// 부서별 파일 목록 조회 쿼리
export const useDepartmentFiles = (params: DepartmentFileRequest, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['departmentFiles', params],
    queryFn: async () => {
      const result = await mediaAPI.getDepartmentFiles(params);
      return result;
    },
    staleTime: 30 * 1000, // 30초 동안 fresh 상태 유지
    gcTime: 5 * 60 * 1000, // 5분
    refetchOnMount: false, // 마운트 시 자동 리페치 비활성화
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
    placeholderData: (previousData) => previousData, // 이전 데이터를 placeholder로 사용
    enabled: options?.enabled !== false, // 기본값은 true
  });
};

// 보관된 파일 목록 조회 쿼리
export const useArchivedFiles = (params: CommonArchivedFileRequest, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['archivedFiles', params],
    queryFn: async () => {
      const result = await mediaAPI.getArchivedFiles(params);
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 15, // 15분
    refetchOnMount: false, // 마운트 시 자동 리페치 비활성화
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
    refetchOnReconnect: false, // 재연결 시 자동 리페치 비활성화
    placeholderData: (previousData: CommonArchivedFileResponse | undefined) => previousData, // 이전 데이터를 placeholder로 사용
    enabled: options?.enabled !== false, // 기본값은 true
  });
};

// 보관된 부서별 파일 목록 조회 쿼리
export const useDepartmentArchivedFiles = (params: DepartmentArchivedFileRequest, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['departmentArchivedFiles', params],
    queryFn: async () => {
      const result = await mediaAPI.getDepartmentArchivedFiles(params);
      return result;
    },
    staleTime: 30 * 1000, // 30초 동안 fresh 상태 유지
    gcTime: 5 * 60 * 1000, // 5분
    refetchOnMount: false, // 마운트 시 자동 리페치 비활성화
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
    placeholderData: (previousData) => previousData, // 이전 데이터를 placeholder로 사용
    enabled: options?.enabled !== false, // 기본값은 true
  });
};

// 파일 버전 히스토리 조회 쿼리
export const useFileVersionHistory = (fileId: number | null, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['fileVersionHistory', fileId],
    queryFn: async () => {
      if (!fileId) throw new Error('File ID is required');
      const result = await mediaAPI.getFileVersionHistory(fileId);
      return result;
    },
    staleTime: 30 * 1000, // 30초 동안 fresh 상태 유지
    gcTime: 5 * 60 * 1000, // 5분
    refetchOnMount: false, // 마운트 시 자동 리페치 비활성화
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
    enabled: options?.enabled !== false && fileId !== null, // fileId가 있을 때만 활성화
  });
};
