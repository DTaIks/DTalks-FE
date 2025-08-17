import { useCallback } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { useDocumentUpdate, useDocumentArchive, useDocumentRestore } from "@/query/useDocumentMutations";
import type { DocumentInfo } from "@/types/document";

interface UseDocumentAllActionsProps {
  documents: DocumentInfo[];
  setSelectedCategory: (category: string) => void;
  setSelectedStatus: (status: string) => void;
  setSearchTerm: (term: string) => void;
  setRefreshKey: (fn: (prev: number) => number) => void;
  isSearchMode: boolean;
  closeConfirmModal: () => void;
  closeUpdateModal: () => void;
  confirmModal: {
    type: 'archive' | 'download';
    fileName: string;
  };
  updateModal: {
    initialData?: {
      fileId?: number;
      fileName: string;
      description: string;
      fileVersion: string;
      category: string;
      fileUrl?: string;
    };
  };
}

// 액션 핸들러 훅
export const useDocumentAllActions = ({
  documents,
  setSelectedCategory,
  setSelectedStatus,
  setSearchTerm,
  setRefreshKey,
  isSearchMode,
  closeConfirmModal,
  closeUpdateModal,
  confirmModal,
  updateModal,
}: UseDocumentAllActionsProps) => {
  const queryClient = useQueryClient();
  
  // 뮤테이션
  const documentUpdateMutation = useDocumentUpdate();
  const documentArchiveMutation = useDocumentArchive();
  const documentRestoreMutation = useDocumentRestore();

  // 검색 핸들러
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setRefreshKey(prev => prev + 1);
    
    queryClient.invalidateQueries({ 
      queryKey: ['documentFilter']
    });
    queryClient.invalidateQueries({ 
      queryKey: ['documentAllList']
    });
  }, [setSelectedCategory, queryClient, setRefreshKey]);

  // 상태 변경 핸들러
  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
    setRefreshKey(prev => prev + 1);
    
    if (!isSearchMode) {
      queryClient.invalidateQueries({ 
        queryKey: ['documentAllList']
      });
      queryClient.invalidateQueries({ 
        queryKey: ['documentFilter']
      });
    }
    
    queryClient.removeQueries({ 
      queryKey: ['documentSearch'],
      exact: false
    });
  }, [setSelectedStatus, queryClient, isSearchMode, setRefreshKey]);

  // 확인 액션 핸들러
  const handleConfirmAction = useCallback(async () => {
    if (confirmModal.type === 'archive') {
      const documentToArchive = documents.find(
        doc => doc.documentName === confirmModal.fileName
      );
      if (documentToArchive) {
        try {
          if (!documentToArchive.isActive) {
            await documentRestoreMutation.mutateAsync(documentToArchive.documentId);
          } else {
            await documentArchiveMutation.mutateAsync(documentToArchive.documentId);
          }
        } catch (error) {
          console.error('문서 보관/복원 실패:', error);
        }
      }
    } else if (confirmModal.type === 'download') {
      const documentToDownload = documents.find(
        doc => doc.documentName === confirmModal.fileName
      );
      if (documentToDownload?.fileUrl) {
        try {
          const response = await fetch(documentToDownload.fileUrl, { method: 'HEAD' });
          if (response.ok) {
            const link = document.createElement('a');
            link.href = documentToDownload.fileUrl;
            link.download = confirmModal.fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            alert('파일을 찾을 수 없습니다. 관리자에게 문의해주세요.');
          }
        } catch (error) {
          alert('파일 다운로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      } else {
        alert('다운로드할 파일 URL이 없습니다.');
      }
    }
    closeConfirmModal();
  }, [confirmModal.type, confirmModal.fileName, closeConfirmModal, documents, documentArchiveMutation, documentRestoreMutation]);

  // 문서 업데이트 핸들러
  const handleDocumentUpdate = useCallback((data: {
    uploadFile?: File;
    fileName: string;
    description: string;
    fileVersion: string;
    category: string;
  }) => {
    if (updateModal.initialData?.fileId) {
      documentUpdateMutation.mutate({
        fileId: updateModal.initialData.fileId,
        file: data.uploadFile || null,
        fileInfo: {
          fileName: data.fileName,
          description: data.description,
          fileVersion: data.fileVersion,
          category: data.category
        }
      });
      closeUpdateModal();
    }
  }, [updateModal.initialData, documentUpdateMutation, closeUpdateModal]);

  return {
    handleSearch,
    handleCategoryChange,
    handleStatusChange,
    handleConfirmAction,
    handleDocumentUpdate,
    documentUpdateMutation,
  };
};