import type { MediaFile, CommonFileInfo, DepartmentFileInfo, CommonArchivedFileInfo, VersionData, FileVersionHistory } from '@/types/media';

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
    isPublic: true, // API에서 isPublic 정보를 제공하지 않으므로 기본값으로 설정
    fileUrl: file.fileUrl // fileUrl 추가
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
    isPublic: true,
    fileUrl: file.fileUrl // fileUrl 추가
  };
};

// API 버전 히스토리를 UI용 VersionData로 변환하는 함수
export const transformFileVersionHistoryToVersionData = (history: FileVersionHistory[]): VersionData[] => {
  return history.map(item => ({
    id: item.versionId.toString(),
    version: item.versionNumber,
    fileName: item.fileName,
    date: item.createdAt,
    uploaderName: item.uploaderName,
    fileSize: '', // API에서 제공하지 않으므로 빈 문자열
    description: item.description,
    updatedAt: item.createdAt
  }));
};

