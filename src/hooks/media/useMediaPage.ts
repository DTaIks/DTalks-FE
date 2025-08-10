import { useMemo } from 'react';
import { useMediaStore } from '@/store/mediaStore';
import { useMediaFiles } from '@/query/useMediaQueries';
import { useFileUpload } from '@/query/useMediaMutations';
import { transformCommonFileToMediaFile } from './useMediaFile';

export const useMediaPage = () => {
  // Zustand store에서 UI 상태 가져오기
  const {
    selectedDepartment,
    selectedFileType,
    isArchiveMode,
    isArchiveClosing,
    currentPage,
    uploadModal,
    confirmModal,
    versionModal,
    setSelectedDepartment,
    setSelectedFileType,
    setArchiveMode,
    setArchiveClosing,
    setCurrentPage,
    openUploadModal,
    closeUploadModal,
    openEditModal,
    openConfirmModal,
    closeConfirmModal,
    openVersionModal,
    closeVersionModal,
  } = useMediaStore();

  // React Query로 서버 상태 관리
  const apiParams = {
    option: selectedDepartment === '전체 파일' ? '전체' : selectedDepartment,
    pageNumber: currentPage, // 서버는 0-based 인덱스 사용
    // 파일 타입 필터도 API에 전달 (API에서 지원하는 경우)
    fileType: selectedFileType !== 'all' ? selectedFileType : undefined,
  };

  console.log('🔍 API 파라미터:', JSON.stringify(apiParams));
  console.log('🔍 선택된 부서:', selectedDepartment);
  console.log('🔍 현재 페이지:', currentPage);
  console.log('🔍 useMediaFiles 호출 시작');

  const { data: mediaData, isLoading, error } = useMediaFiles(apiParams);

  console.log('🔍 useMediaFiles 호출 완료');
  console.log('🔍 API 응답 데이터:', JSON.stringify(mediaData, null, 2));
  console.log('🔍 로딩 상태:', isLoading);
  console.log('🔍 에러 상태:', error);
  
  const uploadMutation = useFileUpload();

  // API 데이터를 MediaFile 형태로 변환
  const apiFiles = useMemo(() => {
    console.log('🔍 mediaData?.commonFileInfoList:', mediaData?.commonFileInfoList);
    if (!mediaData?.commonFileInfoList) {
      console.log('🔍 commonFileInfoList가 없음');
      return [];
    }
    console.log('🔍 변환 시작, 개수:', mediaData.commonFileInfoList.length);
    const transformed = mediaData.commonFileInfoList.map(transformCommonFileToMediaFile);
    console.log('🔍 변환 결과:', transformed);
    return transformed;
  }, [mediaData]);

  console.log('🔍 변환된 API 파일들:', apiFiles);

  // 필터링된 파일들 (API 데이터 기반)
  const filteredFiles = useMemo(() => {
    console.log('🔍 필터링 시작 - apiFiles:', apiFiles);
    console.log('🔍 선택된 부서:', selectedDepartment);
    console.log('🔍 선택된 파일 타입:', selectedFileType);
    
    if (!apiFiles.length) return [];
    
    // API에서 이미 페이지네이션과 필터링이 적용된 데이터를 받으므로
    // 클라이언트에서는 추가 필터링을 하지 않고 그대로 사용
    let filtered = apiFiles;
    
    // 부서별 필터링 (API에서 처리되지 않은 경우에만)
    if (selectedDepartment && selectedDepartment !== '전체 파일') {
      filtered = filtered.filter(file => file.departmentName === selectedDepartment);
    }
    
    // 파일 타입별 필터링 (API에서 처리되지 않은 경우에만)
    if (selectedFileType && selectedFileType !== 'all') {
      filtered = filtered.filter(file => file.fileType === selectedFileType);
    }
    
    console.log('🔍 필터링 결과:', filtered);
    return filtered;
  }, [apiFiles, selectedDepartment, selectedFileType]); // apiFiles를 의존성으로 사용

  console.log('🔍 필터링된 파일들:', filteredFiles);

  // 페이지네이션 정보
  const totalPages = useMemo(() => {
    console.log('🔍 mediaData?.pagingInfo:', mediaData?.pagingInfo);
    if (!mediaData?.pagingInfo) {
      console.log('🔍 pagingInfo가 없음, 기본값 1 반환');
      return 1;
    }
    const pages = mediaData.pagingInfo.totalPageCount || 1;
    console.log('🔍 총 페이지 수:', pages);
    return pages;
  }, [mediaData]);

  // 보관함 관련 핸들러
  const handleArchiveSelect = () => {
    setArchiveMode(true);
    setSelectedDepartment('전체 파일');
    setSelectedFileType('all');
  };

  const handleArchiveClose = () => {
    setArchiveClosing(true);
    setTimeout(() => {
      setArchiveMode(false);
      setArchiveClosing(false);
    }, 400);
  };

  const handleArchiveDepartmentSelect = (departmentName: string) => {
    setSelectedDepartment(departmentName);
    setSelectedFileType('all');
  };

  // 파일 타입 선택 핸들러
  const handleFileTypeSelect = (fileType: '전체' | '문서' | '이미지' | '음성') => {
    const fileTypeMap: Record<string, 'document' | 'image' | 'audio' | 'all'> = {
      '전체': 'all',
      '문서': 'document',
      '이미지': 'image',
      '음성': 'audio',
    };
    setSelectedFileType(fileTypeMap[fileType]);
  };

  // 전체 선택 핸들러
  const handleAllSelect = () => {
    setSelectedDepartment('전체 파일');
    setSelectedFileType('all');
    setArchiveMode(false);
  };

  // 부서 선택 핸들러
  const handleDepartmentSelect = (departmentName: string) => {
    setSelectedDepartment(departmentName);
    setSelectedFileType('all');
    if (!isArchiveMode) {
      setArchiveMode(false);
    }
  };

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
    filteredFiles,
    totalPages,
    isLoading,
    error,
    isUploading: uploadMutation.isPending,

    // 액션
    setSelectedDepartment,
    setSelectedFileType,
    setCurrentPage,
    openUploadModal,
    closeUploadModal,
    openEditModal,
    openConfirmModal,
    closeConfirmModal,
    openVersionModal,
    closeVersionModal,
    handleArchiveSelect,
    handleArchiveClose,
    handleArchiveDepartmentSelect,
    handleFileTypeSelect,
    handleAllSelect,
    handleDepartmentSelect,
    uploadMutation,
  };
};
