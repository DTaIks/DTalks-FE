// API 응답 타입
export interface FAQCategoryApiItem {
  categoryId: number;
  categoryName: string;
  description: string;
  isActive: boolean;
  faqCount: number;
}

// 클라이언트에서 사용하는 FAQ 카테고리 (UI용 필드 포함)
export interface FAQCategory {
  categoryId: string;
  categoryName: string;
  categoryNameImage: string;
  description: string;
  faqCount: number;
  isActive: boolean;
}

// API 관련 타입들 - 서버 응답과 정확히 일치
export interface FAQApiItem {
  faqId: number;
  question: string;
  category: string;
  isActive: boolean;
  updatedAt: string; // yyyy-MM-dd HH:mm 형식
}

// 클라이언트에서 사용하는 FAQ 아이템 (UI용 필드 포함)
export interface FAQItem {
  faqId: number; // API의 faqId를 사용 (단일 식별자)
  question: string;
  category: string;
  categoryImage: string; // 프론트엔드에서 카테고리별로 매핑
  isActive: boolean;
  updatedAt: string; // yyyy-MM-dd HH:mm 형식
  createdAt: string; // updatedAt을 복사하거나 별도 처리
  answer?: string; // 상세 조회시 추가될 수 있는 필드
}

export interface FAQListApiResponse {
  content: FAQApiItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}

// 클라이언트에서 사용하는 FAQ 리스트 응답 (변환된 데이터)
export interface FAQListResponse {
  content: FAQItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}

// API 요청 관련 타입들
export interface FAQListRequest {
  pageNumber: number; // 0부터 시작
  size?: number; // 페이지 크기 (선택사항)
  sort?: string; // 정렬 조건 (선택사항, 예: "updatedAt,desc")
  [key: string]: string | number | undefined; // 기타 추가 파라미터 확장 가능
}

export interface FAQSearchRequest {
  keyword: string; // 검색 키워드
  pageNumber: number; // 0부터 시작
  size?: number; // 페이지 크기 (기본값: 4)
}

export interface FAQFilterRequest {
  categoryName: string; // 카테고리명
  pageNumber: number; // 0부터 시작
  size?: number; // 페이지 크기 (기본값: 4)
}

// 컴포넌트 Props 타입
export interface FAQTableProps {
  faqItems?: FAQItem[];
  isLoading?: boolean;
  error?: unknown;
  isSearchMode?: boolean; // 검색 모드 여부
  searchTerm?: string;
  selectedCategory?: string;
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange?: (categoryValue: string) => void;
  onFAQDetail?: (faqId: number) => void;
  onFAQUpdate?: (faqId: number, faqData: { question: string; answer: string; category: string }) => void;
  onFAQArchive?: (faqId: number) => void;
} 