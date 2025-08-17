import { useQuery } from '@tanstack/react-query';
import { documentAPI } from '@/api/documentAPI';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import type { DocumentInfo } from '@/types/document';

// 카테고리 매핑 함수
const mapCategoryForAPI = (uiCategory: string): string => {
  switch (uiCategory) {
    case '전체 카테고리':
    case '전체':
      return 'all';
    case '사내 정책':
      return 'policy';
    case '용어 사전':
      return 'glossary';
    case '보고서 양식':
      return 'reportform';
    default:
      return 'all';
  }
};

// 상태 매핑 함수
const mapStatusToAPIParam = (status: string): string | undefined => {
  switch (status) {
    case '활성':
      return 'active';
    case '비활성':
      return 'inactive';
    case '전체 상태':
      return 'all';
    default:
      return undefined;
  }
};

const filterDocumentsByStatus = (documents: DocumentInfo[], status: string): DocumentInfo[] => {
  const apiStatus = mapStatusToAPIParam(status);
  
  if (!apiStatus || apiStatus === 'all') {
    return documents;
  }
  
  return documents.filter(doc => {
    if (apiStatus === 'active') {
      return doc.isActive === true;
    } else if (apiStatus === 'inactive') {
      return doc.isActive === false;
    }
    return true;
  });
};

// 전체 문서 목록 조회 쿼리
export const useDocumentAllList = (
  currentPage: number, 
  pageSize: number = 4, 
  status: string = '전체 상태'
) => {
  const pageNumber = currentPage - 1;
  const apiStatus = mapStatusToAPIParam(status);

  return useQuery({
    queryKey: ['documentAllList', pageNumber, pageSize, apiStatus],
    queryFn: async () => {
      const response = await documentAPI.getDocuments({
        pageNumber,
        pageSize,
        categoryName: 'all',
        status: apiStatus 
      });

      return {
        ...response,
        content: response.documentInfoResponseList || [],
        totalPages: response.pagingInfo?.totalPageCount || 0,
        totalElements: response.pagingInfo?.elementCount || 0,
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// 문서 검색 쿼리
export const useDocumentSearch = (
  category: string,
  fileName: string,
  currentPage: number,
  enabled: boolean = true,
  pageSize: number = 4,
  status: string = '전체 상태',
  refreshKey: number = 0
) => {
  const { debouncedValue: debouncedFileName, isDebouncing } = useDebouncedSearch(fileName, 500);
  const pageNumber = currentPage - 1;
  const mappedCategory = mapCategoryForAPI(category);
  const apiStatus = mapStatusToAPIParam(status);

  const queryResult = useQuery({
    queryKey: ['documentSearch', mappedCategory, debouncedFileName, pageNumber, apiStatus, refreshKey],
    queryFn: async () => {   
      const needsStatusFiltering = apiStatus && apiStatus !== 'all';
      
      if (needsStatusFiltering) {
        
        let allFilteredDocuments: DocumentInfo[] = [];
        let searchPageNumber = 0;
        const maxPagesToFetch = 10; // 최대 10페이지까지 검색
        const expandedPageSize = pageSize * 2; // 페이지당 더 많은 데이터 요청
        
        while (allFilteredDocuments.length < (pageNumber + 1) * pageSize && searchPageNumber < maxPagesToFetch) {          
          const response = await documentAPI.searchDocuments({
            category: mappedCategory,
            fileName: debouncedFileName,
            pageNumber: searchPageNumber,
            pageSize: expandedPageSize,
          });

          const documents = response.documentInfoResponseList || [];
          const filteredDocs = filterDocumentsByStatus(documents, status);
          allFilteredDocuments = [...allFilteredDocuments, ...filteredDocs];
          
          if (response.pagingInfo?.isLastPage || documents.length === 0) {
            break;
          }
          
          searchPageNumber++;
        }
        
        // 요청된 페이지에 해당하는 데이터만 추출
        const startIndex = pageNumber * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedDocuments = allFilteredDocuments.slice(startIndex, endIndex);
        const totalFilteredPages = Math.ceil(allFilteredDocuments.length / pageSize);

        console.log('상태 필터링 적용 완료:', { 
          requestedStatus: status,
          totalFilteredCount: allFilteredDocuments.length, 
          currentPageCount: paginatedDocuments.length,
          totalPages: totalFilteredPages,
          requestedPage: pageNumber + 1
        });

        return {
          documentInfoResponseList: paginatedDocuments,
          content: paginatedDocuments,
          totalPages: totalFilteredPages,
          totalElements: allFilteredDocuments.length,
          pagingInfo: {
            currentPageNumber: pageNumber,
            pageSize: pageSize,
            elementCount: allFilteredDocuments.length,
            totalPageCount: totalFilteredPages,
            isLastPage: pageNumber >= totalFilteredPages - 1,
            isEmpty: allFilteredDocuments.length === 0
          }
        };
      } else {  
        const response = await documentAPI.searchDocuments({
          category: mappedCategory,
          fileName: debouncedFileName,
          pageNumber,
          pageSize,
        });

        const allDocuments = response.documentInfoResponseList || [];

        console.log('일반 검색 결과:', {
          검색결과개수: allDocuments.length,
          페이지정보: response.pagingInfo
        });

        return {
          ...response,
          content: allDocuments,
          totalPages: response.pagingInfo?.totalPageCount || 0,
          totalElements: response.pagingInfo?.elementCount || 0,
        };
      }
    },
    enabled: enabled && debouncedFileName.trim().length > 0 && !isDebouncing,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  return {
    ...queryResult,
    isDebouncing,
  };
};

// 문서 카테고리별 필터링 쿼리
export const useDocumentFilter = (
  categoryName: string,
  currentPage: number,
  enabled: boolean = true,
  pageSize: number = 4,
  status: string = '전체 상태'
) => {
  const pageNumber = currentPage - 1;
  const mappedCategory = mapCategoryForAPI(categoryName);
  const apiStatus = mapStatusToAPIParam(status);

  return useQuery({
    queryKey: ['documentFilter', mappedCategory, pageNumber, pageSize, apiStatus],
    queryFn: async () => {
      const response = await documentAPI.getDocuments({
        categoryName: mappedCategory,
        pageNumber,
        pageSize,
        status: apiStatus
      });

      return {
        ...response,
        content: response.documentInfoResponseList || [],
        totalPages: response.pagingInfo?.totalPageCount || 0,
        totalElements: response.pagingInfo?.elementCount || 0,
      };
    },
    enabled: enabled && (mappedCategory !== 'all' || apiStatus !== 'all'),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// 상태별 문서 필터링을 위한 쿼리
export const useDocumentStatusFilter = (
  status: string,
  currentPage: number,
  enabled: boolean = true,
  pageSize: number = 4
) => {
  const pageNumber = currentPage - 1;
  const apiStatus = mapStatusToAPIParam(status);

  return useQuery({
    queryKey: ['documentStatusFilter', apiStatus, pageNumber, pageSize],
    queryFn: async () => {
      
      const response = await documentAPI.getDocuments({
        categoryName: 'all',
        pageNumber,
        pageSize,
        status: apiStatus 
      });

      return {
        ...response,
        content: response.documentInfoResponseList || [],
        totalPages: response.pagingInfo?.totalPageCount || 0,
        totalElements: response.pagingInfo?.elementCount || 0,
      };
    },
    enabled: enabled && apiStatus !== 'all',
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
