import { apiInstance } from './apiInstance';
import type { CommonFileResponse, CommonFileRequest, FileUploadInfo, FileUploadResponse, DepartmentFileResponse, DepartmentFileRequest } from '@/types/media';

export const mediaAPI = {
  // 공통 파일 조회
  getCommonFiles: async (params: CommonFileRequest): Promise<CommonFileResponse> => {
    const response = await apiInstance.get(`/admin/file/common?${new URLSearchParams({
      pageNumber: params.pageNumber.toString(),
      option: params.option || '전체',
      fileType: params.fileType || '전체'
    })}`);
    
    return response.data.data; // data 필드 반환
  },

  // 부서별 파일 조회
  getDepartmentFiles: async (params: DepartmentFileRequest): Promise<DepartmentFileResponse> => {
    const response = await apiInstance.get(`/admin/file/department?${new URLSearchParams({
      pageNumber: params.pageNumber.toString(),
      departmentName: params.departmentName,
      option: params.option || '공통',
      fileType: params.fileType || '전체'
    })}`);
    
    return response.data.data; // data 필드 반환
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
  },

  // 파일 수정
  updateFile: async (fileId: number, file: File | null, fileInfo: FileUploadInfo): Promise<FileUploadResponse> => {
    const formData = new FormData();
    
    // 파일이 있는 경우에만 추가 (수정 시 파일을 변경하지 않을 수도 있음)
    if (file) {
      formData.append('file', file);
    }
    
    // fileInfo를 JSON 문자열로 변환하여 하나의 객체로 전송
    formData.append('fileInfo', JSON.stringify(fileInfo));
    
    // 일반 API 인스턴스 사용 (쿠키 기반 인증)
    const response = await apiInstance.post(`/admin/file/${fileId}/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
};
