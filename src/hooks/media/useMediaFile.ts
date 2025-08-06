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
