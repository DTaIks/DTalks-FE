import type { MediaFile, CommonFileInfo, DepartmentFileInfo, CommonArchivedFileInfo, VersionData } from '@/types/media';

// API 데이터를 MediaFile 형태로 변환하는 유틸리티 함수
export const transformCommonFileToMediaFile = (file: CommonFileInfo | DepartmentFileInfo): MediaFile => {
  return {
    fileId: file.fileId,
    fileName: file.fileName,
    fileSize: file.fileSize,
    updatedAt: file.updatedAt,
    department: file.department,
    description: file.description || '',
    fileVersion: file.latestFileVersionNumber || '1.0.0',
    fileType: file.fileType as '문서' | '이미지' | '음성', // API의 fileType 필드 사용
    isPublic: true // API에서 isPublic 정보를 제공하지 않으므로 기본값으로 설정
  };
};

// 보관된 파일을 MediaFile 형태로 변환하는 유틸리티 함수
export const transformArchivedFileToMediaFile = (file: CommonArchivedFileInfo): MediaFile => {
  return {
    fileId: file.fileId,
    fileName: file.fileName,
    fileSize: file.fileSize,
    updatedAt: file.updatedAt,
    department: file.department,
    description: file.description || '',
    fileVersion: file.latestFileVersionNumber || '1.0.0',
    fileType: file.fileType as '문서' | '이미지' | '음성', // API의 fileType 필드 사용
    isPublic: true
  };
};

// 버전 히스토리 반환 (실제 API 데이터 사용)
export const useVersionHistory = (): VersionData[] => {
  // TODO: 실제 API에서 버전 히스토리를 가져오도록 수정
  // 현재는 빈 배열 반환
  return [];
};

