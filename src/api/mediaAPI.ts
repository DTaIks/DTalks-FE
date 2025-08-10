import { apiInstance } from './apiInstance';
import type { CommonFileResponse, CommonFileRequest, FileUploadInfo, FileUploadResponse } from '@/types/media';

export const mediaAPI = {
  // 공통 파일 목록 조회
  getCommonFiles: async (params: CommonFileRequest): Promise<CommonFileResponse> => {
    const { option, pageNumber, fileType } = params;
    const queryParams = new URLSearchParams();
    
    // option은 필수 파라미터이므로 기본값 설정 (전체로 설정)
    const finalOption = option || '전체'; // 전체 파일로 설정
    queryParams.append('option', finalOption);
    queryParams.append('pageNumber', pageNumber.toString());
    queryParams.append('pageSize', '5'); // 페이지 크기 5로 설정
    
    // 파일 타입 필터 추가 (API에서 지원하는 경우)
    if (fileType) {
      queryParams.append('fileType', fileType);
    }
    
    const url = `/admin/file/common?${queryParams.toString()}`;
    
    console.log('🌐 API 요청 URL:', url);
    console.log('🌐 API 요청 파라미터:', JSON.stringify({ option: finalOption, pageNumber, pageSize: '5' }));
    
    const response = await apiInstance.get(url);
    
    console.log('🌐 API 응답 데이터:', JSON.stringify(response.data, null, 2));
    console.log('🌐 API 응답 data 필드:', JSON.stringify(response.data?.data, null, 2));
    console.log('🌐 파일 목록 개수:', response.data?.data?.commonFileInfoList?.length || 0);
    console.log('🌐 파일 목록:', JSON.stringify(response.data?.data?.commonFileInfoList, null, 2));
    
    // 서버 응답이 {code, status, message, data} 형태인 경우 data 필드를 반환
    return response.data.data || response.data;
  },

  // 파일 업로드
  uploadFile: async (file: File, fileInfo: FileUploadInfo): Promise<FileUploadResponse> => {
    const formData = new FormData();
    
    // 파일 추가
    formData.append('file', file);
    
    // fileInfo를 JSON 문자열로 변환하여 하나의 객체로 전송
    formData.append('fileInfo', JSON.stringify(fileInfo));
    
    // 일반 API 인스턴스 사용 (쿠키 기반 인증)
    const response = await apiInstance.post('/admin/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
};
