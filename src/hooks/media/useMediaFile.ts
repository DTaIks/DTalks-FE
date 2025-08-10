export interface MediaFile {
  fileId: number;
  fileName: string;
  fileSize: string;
  updatedAt: string;
  fileType?: 'document' | 'audio' | 'image';
  departmentName?: string;
  department?: string;
  description?: string;
  fileVersion?: string;
  isPublic?: boolean;
}

export interface Department {
  id: string;
  name: string;
}

export interface VersionData {
  id: string;
  version: string;
  date: string;
  uploaderName: string;
  fileSize: string;
  description?: string;
  updatedAt: string;
}

// API 데이터를 MediaFile 형태로 변환하는 유틸리티 함수
export const transformCommonFileToMediaFile = (commonFile: any): MediaFile => {
  return {
    fileId: commonFile.fileId,
    fileName: commonFile.fileName,
    fileSize: commonFile.fileSize,
    updatedAt: commonFile.updatedAt,
    departmentName: commonFile.department,
    department: commonFile.department,
    // 파일 확장자에 따른 타입 추정
    fileType: getFileTypeFromName(commonFile.fileName),
  };
};

// 파일명에서 파일 타입을 추정하는 함수
const getFileTypeFromName = (fileName: string): 'document' | 'audio' | 'image' => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
  const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'];
  
  if (imageExtensions.includes(extension || '')) {
    return 'image';
  } else if (audioExtensions.includes(extension || '')) {
    return 'audio';
  } else {
    return 'document';
  }
};

export const useDepartmentStats = (): Department[] => {
  const departments: Department[] = [
    { id: 'all', name: '전체 파일' },
    { id: 'marketing', name: '마케팅팀' },
    { id: 'development', name: '개발팀' },
    { id: 'design', name: '디자인팀' }
  ];

  return departments;
};

export const useVersionHistory = (fileName: string): VersionData[] => {
  const versionData: Record<string, VersionData[]> = {
    '제품소개서.pdf': [
      {
        id: '1',
        version: 'v 3.0.1',
        date: '2025년 7월 7일',
        uploaderName: '조선현',
        fileSize: '15.2MB',
        updatedAt: '2025-07-07 14:30',
        description: '최종 검토 완료 후 배포용 버전'
      },
      {
        id: '2',
        version: 'v 2.1.1',
        date: '2025년 7월 5일',
        uploaderName: '전지우',
        fileSize: '14.8MB',
        updatedAt: '2025-07-05 16:45',
        description: '클라이언트 피드백 반영 및 디자인 개선'
      },
      {
        id: '3',
        version: 'v 2.0.1',
        date: '2025년 7월 2일',
        uploaderName: '김동섭',
        fileSize: '14.1MB',
        updatedAt: '2025-07-02 11:20',
        description: '새로운 제품 라인 추가 및 가격 정책 업데이트'
      },
      {
        id: '4',
        version: 'v 1.0.0',
        date: '2025년 6월 28일',
        uploaderName: '김유경',
        fileSize: '13.5MB',
        updatedAt: '2025-06-28 09:15',
        description: '초기 버전 생성'
      }
      
    ],
  };

  const versions = versionData[fileName] || [];
  
  // updatedAt 기준으로 최신 순 정렬
  return versions.sort((a, b) => {
    return new Date(b.updatedAt || '').getTime() - new Date(a.updatedAt || '').getTime();
  });
};
