import { useEffect, useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import DocumentAllStatCard from "@/components/admin/documentAll/DocumentAllStatCard";
import DocumentAllTable from "@/components/admin/documentAll/DocumentAllTable";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { VersionHistoryModal } from "@/components/common/FileVersionManagementModal";
import DocumentUploadModal from "@/components/common/DocumentUploadModal";
import ErrorModal from "@/components/common/ErrorModal";
import { authAPI } from "@/api/authAPI";
import { useDocumentStore } from "@/store/documentStore";
import { useDocumentCountByCategory, useRecentUpdateCountByCategory, useActiveDocumentCountByCategory } from "@/query/useDocumentQueries";

// 분리된 훅들 import
import { useDocumentAllData } from "@/hooks/document/useDocumentAllData";
import { useDocumentAllModals } from "@/hooks/document/useDocumentAllModals";
import { useDocumentAllActions } from "@/hooks/document/usdDocumentAllActions";

const DocumentAllPage = () => {
  useScrollToTop();

  // 전역 상태
  const {
    searchTerm,
    selectedCategory,
    selectedStatus,
    setSearchTerm,
    setSelectedCategory,
    setSelectedStatus,
  } = useDocumentStore();

  // 권한 관련 상태
  const [userRole, setUserRole] = useState<string>("사용자");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 수정 에러 상태
  const [updateError, setUpdateError] = useState("");

  // 1. 데이터 관리
  const {
    currentPage,
    setCurrentPage,
    setRefreshKey,
    documents,
    totalPages,
    currentLoading,
    currentError,
    isSearchMode,
  } = useDocumentAllData();

  // 2. 모달 관리
  const {
    confirmModal,
    versionModal,
    updateModal,
    openConfirmModal,
    closeConfirmModal,
    openVersionModal,
    closeVersionModal,
    openUpdateModal,
    closeUpdateModal,
  } = useDocumentAllModals(documents);

  // 3. 액션 핸들러
  const {
    handleSearch,
    handleCategoryChange,
    handleStatusChange,
    handleConfirmAction,
    handleDocumentUpdate: originalHandleDocumentUpdate,
    documentUpdateMutation,
  } = useDocumentAllActions({
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
  });

  // 수정 핸들러 (에러 처리 강화)
  const handleDocumentUpdate = useCallback(
    async (data: {
      uploadFile?: File;
      fileName: string;
      description: string;
      fileVersion: string;
      category: string;
    }) => {
      console.log("🚀 handleDocumentUpdate 시작", data);
      
      try {
        setUpdateError(""); // 에러 초기화
        console.log("⏳ originalHandleDocumentUpdate 호출 중...");
        
        await originalHandleDocumentUpdate(data);
        
        console.log("✅ originalHandleDocumentUpdate 성공!");
        // 성공 시에만 모달 닫기
        closeUpdateModal();
      } catch (error: any) {
        console.error("❌ 문서 수정 실패:", error);
        console.log("❌ Error status:", error?.response?.status);
        console.log("❌ Error message:", error?.response?.data?.message);

        let errorMessage = "";
        
        if (error?.response?.status === 409) {
          errorMessage = error?.response?.data?.message || 
                        "기존 파일 버전과 같거나 낮은 버전으로 업데이트할 수 없습니다!";
        } else {
          errorMessage = "파일 수정 중 오류가 발생했습니다. 다시 시도해주세요.";
        }
        
        console.log("설정할 에러 메시지:", errorMessage);
        setUpdateError(errorMessage);

        throw error;
      }
    },
    [originalHandleDocumentUpdate, closeUpdateModal]
  );

  // 4. 통계 데이터
  const { data: totalCount } = useDocumentCountByCategory("all");
  const { data: recentUpdateCount } = useRecentUpdateCountByCategory("all");
  const { data: activeCount } = useActiveDocumentCountByCategory("all");

  const stats = useMemo(
    () => [
      {
        title: "전체 문서",
        value: `${totalCount?.documentCount || 0}개`,
        additionalInfo: "총 문서수",
      },
      {
        title: "최근 업데이트 문서 수",
        value: `${recentUpdateCount?.documentCount || 0}개`,
        additionalInfo: "이번 주",
      },
      {
        title: "활성 버전",
        value: `${activeCount?.documentCount || 0}개`,
        additionalInfo: "활성 문서 수",
      },
    ],
    [totalCount, recentUpdateCount, activeCount]
  );

  // 프로필 정보 조회
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await authAPI.getProfile();
        setUserRole(profileData.role);
      } catch (error) {
        console.error("프로필 조회 실패:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // 권한 확인
  const checkUserPermission = useCallback((): boolean => {
    if (!userRole || userRole === "사용자") {
      setErrorMessage("접근 권한이 없습니다.");
      setIsErrorModalOpen(true);
      return false;
    }
    return true;
  }, [userRole]);

  // 초기 상태 설정
  useEffect(() => {
    const { setSelectedStatus, setSelectedCategory } =
      useDocumentStore.getState();
    setSelectedStatus("전체 상태");
    setSelectedCategory("전체 카테고리");
  }, []);

  // 페이지 변경
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  // 모달 객체
  const modals = useMemo(
    () => ({
      confirmModal: {
        open: (type: "archive" | "download" | "restore", fileName: string) => {
          if (!checkUserPermission()) return;
          openConfirmModal(type, fileName);
        },
        close: closeConfirmModal,
      },
      versionModal: {
        open: openVersionModal,
        close: closeVersionModal,

        isOpen: versionModal.isOpen,
      },
    }),
    [openConfirmModal, closeConfirmModal, openVersionModal, closeVersionModal, versionModal.isOpen, checkUserPermission]
  );

  // 권한 체크 포함 업데이트 모달
  const openUpdateModalWithPermission = useCallback(
    (documentName: string) => {
      if (!checkUserPermission()) return;
      setUpdateError(""); // 모달 열 때 에러 초기화
      openUpdateModal(documentName);
    },
    [checkUserPermission, openUpdateModal]
  );

  // 권한 체크 포함 확인 액션
  const handleConfirmActionWithPermission = useCallback(() => {
    if (!checkUserPermission()) return;
    handleConfirmAction();
  }, [checkUserPermission, handleConfirmAction]);

  // 업데이트 모달 닫기 시 에러 초기화
  const closeUpdateModalWithError = useCallback(() => {
    setUpdateError(""); // 에러 메시지 초기화
    closeUpdateModal();
  }, [closeUpdateModal]);

  // 에러 초기화 핸들러
  const handleClearUpdateError = useCallback(() => {
    setUpdateError("");
  }, []);

  return (
    <Container>
      <HeaderWrapper>
        <TitleContainer
          title="전체 문서"
          subtitle="모든 사내 문서를 한 번에 확인하고 정리하세요"
        />
      </HeaderWrapper>

      <DocumentAllStatCard stats={stats} />

      <DocumentAllTable
        documents={documents}
        modals={modals}
        isLoading={currentLoading}
        isSearchMode={isSearchMode}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        userRole={userRole}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onUpdate={openUpdateModalWithPermission}
        error={currentError}
      />

      {!currentLoading && totalPages > 1 && (
        <PaginationContainer>
          <Pagination
            key={totalPages}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </PaginationContainer>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmActionWithPermission}
        fileName={confirmModal.fileName}
        type={confirmModal.type}
      />

      <VersionHistoryModal
        isOpen={versionModal.isOpen}
        onClose={closeVersionModal}
        fileName={versionModal.fileName}
        fileId={versionModal.fileId || undefined}
        pageType="document"
      />

      <DocumentUploadModal
        isOpen={updateModal.isOpen}
        onClose={closeUpdateModalWithError}
        onSubmit={handleDocumentUpdate}
        isSubmitting={documentUpdateMutation.isPending}
        mode="update"
        initialData={updateModal.initialData}
        submitError={updateError}
        onClearError={handleClearUpdateError}
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => {
          setIsErrorModalOpen(false);
          setErrorMessage("");
        }}
        errorMessage={errorMessage}
      />
    </Container>
  );
};

export default DocumentAllPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  position: relative;
  width: 1056px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 32px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 24px;
`;