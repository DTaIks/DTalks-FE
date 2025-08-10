import styled from 'styled-components';
import React, { useState, useMemo } from 'react';
import { usePermissionStore } from '@/store/permissionStore';
import { useAdminUsers, useAdminUserSearch } from '@/query/useAdminUser';
import { useRoleManagement } from '@/query/usePermission';
import type { PermissionUser } from '@/types/permission';
import type { User } from '@/types/user';
import ModalHeader from '@/components/admin/permission/RoleModalHeader';
import { RoleInfoSection } from './RoleInfoSection';
import { UserSearchSection } from './RoleUserSearchSection';
import { ActionSection } from './RoleSaveButtonSection';

interface RoleManagementProps {
  open: boolean;
  onClose: () => void;
  selectedUser: PermissionUser | null;
}

const RoleManagement = ({ open, onClose, selectedUser }: RoleManagementProps) => {
  const { clearSelectedUserIds, selectedUserIds, setSelectedUserIds } = usePermissionStore(); 
  
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 권한 관리 훅
  const { handleRoleChange, isLoading: isSaving } = useRoleManagement();

  // 모달이 열릴 때 상태 초기화
  React.useEffect(() => {
    if (open) {
      clearSelectedUserIds();
      setSearchTerm('');
      setCurrentPage(1);
      setIsSearchMode(false);
    }
  }, [open, clearSelectedUserIds]);

  // 검색어 변경 감지
  React.useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearchMode(true);
      setCurrentPage(1);
    } else {
      setIsSearchMode(false);
      setCurrentPage(1);
    }
  }, [searchTerm]);

  // 사용자 목록 조회
  const {
    data: userListData,
    isLoading: isUserListLoading,
    error: userListError
  } = useAdminUsers({
    pageNumber: currentPage,
    pageSize: 4
  });

  // 사용자 검색
  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError
  } = useAdminUserSearch(
    {
      name: searchTerm.trim(),
      pageNumber: currentPage,
      pageSize: 4
    },
    isSearchMode && searchTerm.trim().length > 0
  );

  // 현재 표시할 데이터 결정
  const currentData = useMemo(() => {
    if (isSearchMode) {
      return searchData?.data;
    }
    return userListData?.data;
  }, [isSearchMode, searchData, userListData]);

  // 로딩 상태
  const isLoading = isSearchMode ? isSearchLoading : isUserListLoading;
  
  // 에러 상태
  const error = isSearchMode ? searchError : userListError;

  // 해당 권한을 가진 사용자들을 자동 선택 (데이터가 로딩될 때마다)
  React.useEffect(() => {
    if (currentData?.adminInfoList && selectedUser?.roleName && open) {
      const usersWithSelectedRole = currentData.adminInfoList
        .filter((user: User) => user.role === selectedUser.roleName)
        .map((user: User) => user.userId);
      
      if (usersWithSelectedRole.length > 0) {
        // 기존 선택된 사용자들과 합치기 (중복 제거)
        setSelectedUserIds(prev => Array.from(new Set([...prev, ...usersWithSelectedRole])));
      }
    }
  }, [currentData, selectedUser?.roleName, open, setSelectedUserIds]);

  // 테이블 데이터 변환
  const tableData = useMemo(() => {
    if (!currentData?.adminInfoList) return [];
    
    return currentData.adminInfoList.map((user: User) => ({
      userId: user.userId,
      name: user.userName,
      email: user.email,
      department: user.department,
      role: user.role
    }));
  }, [currentData]);

  // 이벤트 핸들러들
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSave = () => {
    if (!selectedUser?.roleId || !selectedUser?.roleName) {
      return;
    }

    const userIds = selectedUserIds.filter((id): id is number => Boolean(id));

    handleRoleChange(
      userIds,
      selectedUser.roleId,
      () => {
        // 성공 콜백
        clearSelectedUserIds();
        onClose();
      },
    );
  };

  if (!open) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader 
          title={`${selectedUser?.roleName || "관리자"} 관리`}
          onClose={onClose}
        />
        
        <RoleInfoSection selectedUser={selectedUser} />
        
        <UserSearchSection
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          isLoading={isLoading}
          error={error}
          tableData={tableData}
          currentPage={currentPage}
          totalPages={currentData?.pagingInfo?.totalPageCount || 1}
          onPageChange={handlePageChange}
          isSearchMode={isSearchMode}
        />
        
        <ActionSection
          selectedCount={selectedUserIds.length}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </ModalContainer>
    </ModalOverlay>
  );
};

export default RoleManagement;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(3.75px);
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 868px;
  height: 720px;
  flex-shrink: 0;
  border-radius: 19.5px;
  background: #FFF;
  position: relative;
`;
