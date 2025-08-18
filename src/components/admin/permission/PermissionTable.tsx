import React, { useCallback } from "react";
import styled from "styled-components";
import RoleManagement from "./RoleManagement";
import { usePermissionStore } from "@/store/permissionStore";
import TableHeader from "@/components/admin/permission/PermissionTableHeader";
import TableRow from "@/components/admin/permission/PermissionTableRow";
import EmptyState from "@/components/common/EmptyState";
import { usePermissions } from "@/query/usePermission";
import type { PermissionRole } from "@/types/permission";

import Roll1 from '@/assets/permission/PermissionRoll1.svg';
import Roll2 from '@/assets/permission/PermissionRoll2.svg';
import Roll3 from '@/assets/permission/PermissionRoll3.svg';

const roleInfo = [
  {
    roleId: 1,
    roleName: "관리자",
    roleNameEn: "Administrator",
    description: "시스템 관리 및 전체 권한 보유",
    image: Roll1,
  },
  {
    roleId: 2,
    roleName: "편집자",
    roleNameEn: "Editor",
    description: "콘텐츠 관리, 편집 및 게시 권한",
    image: Roll2,
  },
  {
    roleId: 3,
    roleName: "사용자",
    roleNameEn: "User",
    description: "기본 읽기 및 제한된 쓰기 권한",
    image: Roll3,
  },
];

const PermissionTable: React.FC = () => {
  const { selectedUser, isModalOpen, setSelectedUser, setModalOpen } = usePermissionStore();
  const { data: permissionData = [], isLoading, isError } = usePermissions();

  const handleEditClick = useCallback((user: PermissionRole) => {
    setSelectedUser(user);
    setModalOpen(true);
  }, [setSelectedUser, setModalOpen]);

  const handleEditModalClose = useCallback(() => {
    setModalOpen(false);
    setSelectedUser(null);
  }, [setModalOpen, setSelectedUser]);

  const renderEmptyState = () => {
    if (isLoading) {
      return <EmptyState message="사용자 권한 목록을 불러오고 있습니다..." subMessage="잠시만 기다려주세요." />;
    }
    if (isError) {
      return <EmptyState message="사용자 권한 목록을 불러올 수 없습니다." subMessage="권한을 확인해주세요." />;
    }
    if (permissionData.length === 0) {
      return <EmptyState message="등록된 권한이 없습니다." subMessage="새로운 권한을 추가해보세요." />;
    }
    return null;
  };

  const mergedData: PermissionRole[] = permissionData.map(item => {
    const fixed = roleInfo.find(r => r.roleId === item.roleId);
    return {
      roleId: item.roleId,
      roleUserCount: item.roleUserCount,
      isActive: item.isActive,
      roleName: fixed?.roleName ?? "",
      roleNameEn: fixed?.roleNameEn ?? "",
      description: fixed?.description ?? "",
      image: fixed?.image ?? "",
    };
  });

  const renderTableRow = useCallback((user: PermissionRole) => (
    <TableRow
      key={user.roleId}
      user={user}
      onEditClick={handleEditClick}
    />
  ), [handleEditClick]);

  const emptyState = renderEmptyState();
  if (emptyState) {
    return (
      <TableWrapper>
        <TableBox>
          <TableHeader />
          {emptyState}
        </TableBox>
        <RoleManagement
          open={isModalOpen}
          onClose={handleEditModalClose}
          selectedUser={selectedUser}
        />
      </TableWrapper>
    );
  }

  return (
    <>
      <TableWrapper>
        <TableBox>
          <Table>
            <TableHeader />
            <TableBody>
              {mergedData.map(renderTableRow)}
            </TableBody>
          </Table>
        </TableBox>
      </TableWrapper>

      <RoleManagement
        open={isModalOpen}
        onClose={handleEditModalClose}
        selectedUser={selectedUser}
      />
    </>
  );
};

export default PermissionTable;

const TableWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TableBox = styled.div`
  width: 1062px;
  background: var(--color-white);
  border-radius: 18.5px;
  box-shadow: 0px 0px 10.5px 2.1px rgba(153, 102, 204, 0.05);
  overflow: hidden;
  padding-bottom: 32px;
`;

const Table = styled.div`
  width: 100%;
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 56px;
  padding-top: 32px;
`;
