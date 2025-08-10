import { useMemo } from 'react';
import { useMediaStore } from '@/store/mediaStore';
import { useMediaFiles, useDepartmentFiles, useArchivedFiles, useDepartmentArchivedFiles } from '@/query/useMediaQueries';
import { useFileUpload, useFileUpdate, useFileArchive } from '@/query/useMediaMutations';
import { transformCommonFileToMediaFile, transformArchivedFileToMediaFile } from './useMediaFile';

// 부서명 매핑 상수
const DEPARTMENT_MAPPING: Record<string, string> = {
  '전체 파일': '전체',
  '마케팅팀': 'media',
  '개발팀': 'develop', 
  '디자인팀': 'art'
};

export const useMediaPage = () => {
  // Zustand 스토어에서 상태 가져오기
  const {
    selectedDepartment,
    selectedFileType,
    isArchiveMode,
    isArchiveClosing,
    currentPage,
    uploadModal,
    confirmModal,
    versionModal,
    setCurrentPage,
    setSelectedDepartment,
    setSelectedFileType,
    setArchiveMode,
    openUploadModal,
    closeUploadModal,
    openEditModal,
    openConfirmModal,
    closeConfirmModal,
    openVersionModal,
    closeVersionModal,
    setSelectedFile,
  } = useMediaStore();



  // 부서명을 API용으로 변환하는 함수
  const getDepartmentNameForAPI = (uiDepartmentName: string): string => {
    return DEPARTMENT_MAPPING[uiDepartmentName] || '전체';
  };

  // API 파라미터 - API에서 직접 필터링
  const commonApiParams = useMemo(() => ({
    pageNumber: currentPage - 1, // API는 0부터 시작
    option: selectedFileType, // 파일 타입을 option 파라미터로 전송
    fileType: '전체' // fileType은 기본값으로 설정
  }), [currentPage, selectedFileType]);

  const departmentApiParams = useMemo(() => ({
    pageNumber: currentPage - 1, // API는 0부터 시작
    departmentName: getDepartmentNameForAPI(selectedDepartment),
    option: selectedFileType, // 파일 타입을 option 파라미터로 전송
    fileType: '전체' // fileType은 기본값으로 설정
  }), [currentPage, selectedDepartment, selectedFileType]);

  // 보관된 파일 API 파라미터
  const archivedApiParams = useMemo(() => ({
    pageNumber: currentPage - 1, // API는 0부터 시작
    option: selectedFileType, // 파일 타입을 option 파라미터로 전송
    fileType: '전체' // fileType은 기본값으로 설정
  }), [currentPage, selectedFileType]);

  // 보관된 부서별 파일 API 파라미터
  const departmentArchivedApiParams = useMemo(() => ({
    pageNumber: currentPage - 1, // API는 0부터 시작
    departmentName: getDepartmentNameForAPI(selectedDepartment),
    option: selectedFileType, // 파일 타입을 option 파라미터로 전송
    fileType: '전체' // fileType은 기본값으로 설정
  }), [currentPage, selectedDepartment, selectedFileType]);

  // 부서가 '전체 파일'이 아닌 경우 부서별 API 사용
  const isDepartmentSpecific = useMemo(() => 
    Boolean(selectedDepartment && selectedDepartment !== '전체 파일'),
    [selectedDepartment]
  );
  
  // API 쿼리
  const { 
    data: commonMediaData, 
    isLoading: isCommonLoading, 
    error: commonError 
  } = useMediaFiles(commonApiParams, {
    enabled: !isDepartmentSpecific
  });

  const { 
    data: departmentMediaData, 
    isLoading: isDepartmentLoading, 
    error: departmentError 
  } = useDepartmentFiles(departmentApiParams, {
    enabled: isDepartmentSpecific
  });

  // 보관된 파일 쿼리
  const { 
    data: archivedMediaData, 
    isLoading: isArchivedLoading, 
    error: archivedError 
  } = useArchivedFiles(archivedApiParams, {
    enabled: isArchiveMode && selectedDepartment === '전체 파일'
  });

  // 보관된 부서별 파일 쿼리
  const { 
    data: departmentArchivedMediaData, 
    isLoading: isDepartmentArchivedLoading, 
    error: departmentArchivedError 
  } = useDepartmentArchivedFiles(departmentArchivedApiParams, {
    enabled: isArchiveMode && selectedDepartment !== '전체 파일'
  });

  // 현재 사용할 데이터와 로딩 상태 결정
  const mediaData = isArchiveMode 
    ? (selectedDepartment === '전체 파일' ? archivedMediaData : departmentArchivedMediaData)
    : (isDepartmentSpecific ? departmentMediaData : commonMediaData);
  
  const isLoading = isArchiveMode 
    ? (selectedDepartment === '전체 파일' ? isArchivedLoading : isDepartmentArchivedLoading)
    : (isDepartmentSpecific ? isDepartmentLoading : isCommonLoading);
  
  const error = isArchiveMode 
    ? (selectedDepartment === '전체 파일' ? archivedError : departmentArchivedError)
    : (isDepartmentSpecific ? departmentError : commonError);



  const uploadMutation = useFileUpload();
  const updateMutation = useFileUpdate();
  const archiveMutation = useFileArchive();

  // API 파일 데이터
  const apiFiles = useMemo(() => {
    // 로딩 중이거나 데이터가 없으면 빈 배열 반환
    if (isLoading || !mediaData) return [];

    let fileList;
    if (isArchiveMode) {
      // 보관함 모드
      if (selectedDepartment === '전체 파일' && 'commonArchivedFileInfoList' in mediaData) {
        fileList = mediaData.commonArchivedFileInfoList;
      } else if (selectedDepartment !== '전체 파일' && 'departmentArchivedFileInfoList' in mediaData) {
        fileList = mediaData.departmentArchivedFileInfoList;
      } else {
        return [];
      }
      return fileList.map(transformArchivedFileToMediaFile);
    } else {
      // 일반 파일 모드
      if (isDepartmentSpecific && 'departmentFileInfoList' in mediaData) {
        fileList = mediaData.departmentFileInfoList;
      } else if (!isDepartmentSpecific && 'commonFileInfoList' in mediaData) {
        fileList = mediaData.commonFileInfoList;
      } else {
        return [];
      }
      return fileList.map(transformCommonFileToMediaFile);
    }
  }, [mediaData, isArchiveMode, isLoading, selectedDepartment, isDepartmentSpecific]);

  // API에서 이미 필터링된 데이터를 사용
  const files = apiFiles;

  // 페이지네이션 정보
  const totalPages = mediaData?.pagingInfo?.totalPageCount || 1;

  // 통합된 핸들러들
  const handlers = useMemo(() => ({
    // 페이지 변경
    setCurrentPage: (page: number) => setCurrentPage(page),
    
    // 부서 선택 (전체 파일 포함)
    selectDepartment: (departmentName: string) => {
      setSelectedDepartment(departmentName);
      setCurrentPage(1); // 부서 변경 시 첫 페이지로 이동
    },
    
    // 파일 타입 선택
    selectFileType: (fileType: string) => {
      setSelectedFileType(fileType as '전체' | '문서' | '이미지' | '음성');
      setCurrentPage(1); // 파일 타입 변경 시 첫 페이지로 이동
    },
    
    // 보관함 관련
    toggleArchive: (isArchive: boolean) => {
      setArchiveMode(isArchive);
      setCurrentPage(1); // 보관함 모드 변경 시 첫 페이지로 이동
    },
    
    // 보관함에서 부서 선택
    selectArchiveDepartment: (departmentName: string) => {
      setSelectedDepartment(departmentName);
      setCurrentPage(1); // 보관함에서 부서 변경 시 첫 페이지로 이동
    }
      }), [setCurrentPage, setSelectedDepartment, setSelectedFileType, setArchiveMode]);

  return {
    // 상태
    selectedDepartment,
    selectedFileType,
    isArchiveMode,
    isArchiveClosing,
    currentPage,
    uploadModal,
    confirmModal,
    versionModal,
    files,
    totalPages,
    isLoading,
    error,
    isUploading: uploadMutation.isPending,
    isUpdating: updateMutation.isPending,
    isArchiving: archiveMutation.isPending,
    
    // 액션
    ...handlers,
    openUploadModal,
    closeUploadModal,
    openEditModal,
    openConfirmModal,
    closeConfirmModal,
    openVersionModal,
    closeVersionModal,
    setSelectedFile,
    uploadMutation,
    updateMutation,
    archiveMutation,
  };
};
