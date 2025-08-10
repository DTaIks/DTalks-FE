import styled from "styled-components";
import RoleManagement from "./RoleManagement";
import { usePermissionStore } from "@/store/permissionStore";
import TableHeader from "@/components/admin/permission/PermissionTableHeader";
import TableRow from "@/components/admin/permission/PermissionTableRow";
import { usePermissions } from "@/query/usePermission";
import type { PermissionUser } from "@/types/permission";

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

const PermissionTable = () => {
  const { selectedUser, isModalOpen, setSelectedUser, setModalOpen } = usePermissionStore();
  const { data: permissionData, isLoading, isError } = usePermissions();

  const handleEditClick = (user: PermissionUser) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleEditModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>데이터를 불러오는 데 실패했습니다.</div>;

  const mergedData: PermissionUser[] = (permissionData ?? []).map(item => {
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

  return (
    <>
      <TableWrapper>
        <TableBox>
          <Table>
            <TableHeader />
            <TableBody>
              {mergedData.map(user => (
                <TableRow
                  key={user.roleId}
                  user={user}
                  onEditClick={handleEditClick}
                />
              ))}
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
