import { useQuery } from '@tanstack/react-query';
import { mediaAPI } from '@/api/mediaAPI';
import type { CommonFileRequest } from '@/types/media';

// 파일 목록 조회 쿼리
export const useMediaFiles = (params: CommonFileRequest) => {
  console.log('🚀 useMediaFiles 쿼리 시작:', JSON.stringify(params));
  
  return useQuery({
    queryKey: ['mediaFiles', params],
    queryFn: async () => {
      console.log('🚀 mediaAPI.getCommonFiles 호출:', JSON.stringify(params));
      const result = await mediaAPI.getCommonFiles(params);
      console.log('🚀 mediaAPI.getCommonFiles 결과:', JSON.stringify(result, null, 2));
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
