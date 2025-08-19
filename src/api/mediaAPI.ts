import { apiInstance } from './apiInstance';
import type { CommonFileResponse, CommonFileRequest, FileUploadInfo, FileUploadResponse, DepartmentFileResponse, DepartmentFileRequest, CommonArchivedFileResponse, CommonArchivedFileRequest, DepartmentArchivedFileResponse, DepartmentArchivedFileRequest, FileVersionHistory } from '@/types/media';
import type { MediaUploadData } from '@/types/modal';

export const mediaAPI = {
  // 공통 파일 조회
  getCommonFiles: async (params: CommonFileRequest): Promise<CommonFileResponse> => {
    const response = await apiInstance.get(`/admin/file/common?${new URLSearchParams({
      pageNumber: params.pageNumber.toString(),
      option: params.option || '전체',
      fileType: params.fileType || '전체'
    })}`);
    
    // 서버 응답 구조에 따라 data 필드 또는 전체 응답 반환
    return response.data.data || response.data;
  },

  // 부서별 파일 조회
  getDepartmentFiles: async (params: DepartmentFileRequest): Promise<DepartmentFileResponse> => {
    const response = await apiInstance.get(`/admin/file/department?${new URLSearchParams({
      pageNumber: params.pageNumber.toString(),
      departmentName: params.departmentName,
      option: params.option || '공통',
      fileType: params.fileType || '전체'
    })}`);
    
    // 서버 응답 구조에 따라 data 필드 또는 전체 응답 반환
    return response.data.data || response.data;
  },

  // 파일 업로드
  uploadFile: async (file: File, fileInfo: FileUploadInfo | MediaUploadData): Promise<FileUploadResponse> => {
    const formData = new FormData();
    // 파일 추가
    formData.append('file', file);
    
    // fileInfo에서 uploadFile 필드를 제거 (MediaUploadData인 경우)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uploadFile, ...cleanFileInfo } = fileInfo as FileUploadInfo & { uploadFile?: File };
    formData.append('fileInfo', JSON.stringify(cleanFileInfo));
    
    console.log('업로드할 파일 정보:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      cleanFileInfo
    });
    
    try {
      // 일반 API 인스턴스 사용 (쿠키 기반 인증)
      const response = await apiInstance.post('/admin/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('업로드 성공 응답:', response.data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { 
        message?: string; 
        response?: { 
          status?: number; 
          statusText?: string; 
          data?: unknown; 
        }; 
        config?: { 
          url?: string; 
          method?: string; 
          headers?: unknown; 
        }; 
      };
      console.error('파일 업로드 API 에러 상세 정보:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        config: {
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          headers: axiosError.config?.headers
        }
      });
      
      // 서버 응답 데이터가 있다면 출력
      if (axiosError.response?.data) {
        console.error('서버 응답 데이터:', axiosError.response.data);
      }
      
      throw error;
    }
  },

  // 파일 수정
  updateFile: async (fileId: number, file: File | null, fileInfo: FileUploadInfo | MediaUploadData): Promise<FileUploadResponse> => {
    const formData = new FormData();
    // 파일이 있는 경우에만 추가 (수정 시 파일을 변경하지 않을 수도 있음)
    if (file) {
      formData.append('file', file);
    }
    
    // fileInfo에서 uploadFile 필드를 제거 (MediaUploadData인 경우)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uploadFile, ...cleanFileInfo } = fileInfo as FileUploadInfo & { uploadFile?: File };
    formData.append('fileInfo', JSON.stringify(cleanFileInfo));
    
    console.log('수정할 파일 정보:', {
      fileId,
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      cleanFileInfo
    });
    
    try {
      // 일반 API 인스턴스 사용 (쿠키 기반 인증)
      const response = await apiInstance.post(`/admin/file/${fileId}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('수정 성공 응답:', response.data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { 
        message?: string; 
        response?: { 
          status?: number; 
          statusText?: string; 
          data?: unknown; 
        }; 
        config?: { 
          url?: string; 
          method?: string; 
          headers?: unknown; 
        }; 
      };
      console.error('파일 수정 API 에러 상세 정보:', {
        fileId,
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        config: {
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          headers: axiosError.config?.headers
        }
      });
      
      // 서버 응답 데이터가 있다면 출력
      if (axiosError.response?.data) {
        console.error('서버 응답 데이터:', axiosError.response.data);
      }
      
      throw error;
    }
  },
  // 파일 보관
  archiveFile: async (fileId: number): Promise<void> => {
    await apiInstance.patch(`/admin/file/${fileId}/archive`);
  },

  // 보관된 파일 조회
  getArchivedFiles: async (params: CommonArchivedFileRequest): Promise<CommonArchivedFileResponse> => {
    const response = await apiInstance.get(`/admin/file/common/archive?${new URLSearchParams({
      option: params.option || '전체',
      pageNumber: params.pageNumber.toString(),
      fileType: params.fileType || '전체'
    })}`);
    
    // 서버 응답 구조에 따라 data 필드 또는 전체 응답 반환
    return response.data.data || response.data;
  },

  // 보관된 부서별 파일 조회
  getDepartmentArchivedFiles: async (params: DepartmentArchivedFileRequest): Promise<DepartmentArchivedFileResponse> => {
    const response = await apiInstance.get(`/admin/file/department/archive?${new URLSearchParams({
      option: params.option || '전체',
      departmentName: params.departmentName,
      pageNumber: params.pageNumber.toString(),
      fileType: params.fileType || '전체'
    })}`);
    
    // 서버 응답 구조에 따라 data 필드 또는 전체 응답 반환
    return response.data.data || response.data;
  },

  // 파일 버전 히스토리 조회
  getFileVersionHistory: async (fileId: number): Promise<FileVersionHistory[]> => {
    const response = await apiInstance.get(`/admin/file/${fileId}/history`);
    // 서버 응답 구조에 따라 data 필드 또는 전체 응답 반환
    return response.data.data || response.data;
  }
};
