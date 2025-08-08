export interface MediaFile {
  fileId: number;
  fileName: string;
  fileSize: string;
  updatedAt: string;
  fileType: 'document' | 'audio' | 'image';
  departmentName?: string;
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

// 테스트용 더미 데이터
export const useFiles = (): MediaFile[] => {
  const files: MediaFile[] = [
    {
      fileId: 1,
      fileName: '제품소개서.pdf',
      fileSize: '15.2MB',
      updatedAt: '2025-07-07 12:30',
      fileType: 'document',
      departmentName: '마케팅팀',
      description: '제품 소개 및 특징을 담은 문서',
      fileVersion: '1.0.0',
      isPublic: true
    },
    {
      fileId: 2,
      fileName: '벤치마킹 보고서.docx',
      fileSize: '7.8MB',
      updatedAt: '2025-07-03 12:30',
      fileType: 'document',
      departmentName: '개발팀'
    },
    {
      fileId: 3,
      fileName: '로고 이미지.png',
      fileSize: '2.3MB',
      updatedAt: '2025-07-01 12:30',
      fileType: 'image',
      departmentName: '디자인팀'
    },
    {
      fileId: 4,
      fileName: '벤치마킹 보고서.docx',
      fileSize: '12.5MB',
      updatedAt: '2025-06-28 12:30',
      fileType: 'document',
      departmentName: '개발팀'
    },
    {
      fileId: 5,
      fileName: '회의록.mp3',
      fileSize: '4.2MB',
      updatedAt: '2025-06-25 12:30',
      fileType: 'audio',
      departmentName: '마케팅팀'
    },
    {
      fileId: 6,
      fileName: '결산 보고서.docx',
      fileSize: '12.5MB',
      updatedAt: '2025-06-28 12:30',
      fileType: 'document',
      departmentName: '마케팅팀'
    },
    {
      fileId: 7,
      fileName: 'UI 디자인.pdf',
      fileSize: '25.8MB',
      updatedAt: '2025-05-15 12:30',
      fileType: 'image',
      departmentName: '디자인팀'
    },
    {
      fileId: 8,
      fileName: '프로젝트 회고.pdf',
      fileSize: '8.9MB',
      updatedAt: '2025-04-20 12:30',
      fileType: 'document',
      departmentName: '개발팀'
    },
    {
      fileId: 9,
      fileName: '인터뷰 녹음.mp3',
      fileSize: '18.7MB',
      updatedAt: '2025-03-28 12:30',
      fileType: 'audio',
      departmentName: '마케팅팀'
    },
    {
      fileId: 10,
      fileName: '브랜드 가이드.pdf',
      fileSize: '6.4MB',
      updatedAt: '2025-02-10 12:30',
      fileType: 'document',
      departmentName: '디자인팀'
    },
  ];

  return files;
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
