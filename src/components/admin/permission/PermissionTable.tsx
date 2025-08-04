import styled from "styled-components";
import ActiveIcon from "../../../assets/common/Active.svg";
import RoleManagement from "./RoleManagement";
import { usePermissionStore } from "../../../store/permissionStore";

interface PermissionUser {
  roleId: number;
  image: string;
  roleName: string;
  roleNameEn: string;
  description: string;
  roleUserCount: number;
  isActive: string;
}

const permissionData: PermissionUser[] = [
  {
    roleId: 1,
    image: '/src/assets/permission/Roll.svg',
    roleName: "관리자",
    roleNameEn: "Administrator",
    description: "시스템 관리 및 전체 권한 보유",
    roleUserCount: 1,
    isActive: "active",
  },
  {
    roleId: 2,
    image: '/src/assets/permission/Roll2.svg',
    roleName: "편집자",
    roleNameEn: "Editor",
    description: "콘텐츠 관리, 편집 및 게시 권한",
    roleUserCount: 5,
    isActive: "active",
  },
  {
    roleId: 3,
    image: '/src/assets/permission/Roll3.svg',
    roleName: "사용자",
    roleNameEn: "User",
    description: "기본 읽기 및 제한된 쓰기 권한",
    roleUserCount: 10,
    isActive: "active",
  }
];

const PermissionTable = () => {
  const { selectedUser, isModalOpen, setSelectedUser, setModalOpen } = usePermissionStore();

  const handleEditClick = (user: PermissionUser) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleEditModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <TableWrapper>
        <TableBox>
          <Table>
                         <TableHead>
               <TableRow>
                 <TableCell>역할명</TableCell>
                 <TableCell>설명</TableCell>
                 <TableCell>사용자 수</TableCell>
                 <TableCell>상태</TableCell>
                 <TableCell>작업</TableCell>
               </TableRow>
             </TableHead>
            <TableBody>
              {permissionData.map((user) => (
                <TableRow key={user.roleId}>
                  <TableCell>
                    <RoleImage src={user.image} alt={user.roleName} />
                    <NameTextBox>
                      <NameText>{user.roleName}</NameText>
                      <EngNameText>{user.roleNameEn}</EngNameText>
                    </NameTextBox>
                  </TableCell>
                  <TableCell>
                    <DescriptionText>{user.description}</DescriptionText>
                  </TableCell>
                  <TableCell>
                    <UserCountText>{user.roleUserCount}명</UserCountText>
                  </TableCell>
                  <TableCell center>
                    <StatusIcon src={ActiveIcon} alt={user.isActive} />
                  </TableCell>
                  <TableCell>
                    <ActionText onClick={() => handleEditClick(user)}>수정</ActionText>
                  </TableCell>
                </TableRow>
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

const TableHead = styled.div`
  height: 60px;
  border-bottom: 1.5px solid #E9E0F0;
  background: #FFF;
  display: flex;
  align-items: center;
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 56px;
  padding-top: 32px;
`;

const TableRow = styled.div`
  width: 1052px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
`;

const TableCell = styled.div<{ center?: boolean }>`
  display: flex;
  align-items: center;
  padding-left: 36px;
  justify-content: ${({ center }) => center ? 'center' : 'flex-start'};
  color: #000;
  font-size: var(--font-size-16);
  font-weight: 500;
  
  &:nth-child(1) {
    width: 24%;
  }
  
  &:nth-child(2) {
    width: 36%;
  }
  
  &:nth-child(3) {
    width: 8%;
  }
  
  &:nth-child(4) {
    width: 20%;
    justify-content: center;
  }
  
  &:nth-child(5) {
    width: 8%;
  }
`;

const RoleImage = styled.img`
  width: 33.6px;
  height: 33.6px;
  border-radius: 8.4px;
  background: #ffa800;
  object-fit: cover;
  margin-right: 10px;
`;

const NameTextBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const NameText = styled.span`
  font-size: 16.8px;
  font-weight: 700;
  color: var(--color-black);
  width: 100%;
  text-align: left;
`;

const EngNameText = styled.span`
  font-size: 14px;
  color: #888;
  width: 100%;
  text-align: left;
`;

const DescriptionText = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const UserCountText = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
`;

const StatusIcon = styled.img`
  width: 56px;
  height: 32px;
  object-fit: contain;
`;

const ActionText = styled.span`
  color: var(--color-black);
  font-size: 16.8px;
  cursor: pointer;
  border-radius: 2.8px;
  transition: color 0.2s;
  &:hover {
    color: var(--color-mediumpurple-300);
  }
`;