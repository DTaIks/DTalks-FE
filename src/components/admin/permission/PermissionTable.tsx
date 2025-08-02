import styled from "styled-components";
import Roll1 from '../../../assets/Permission/Roll.svg';
import Roll2 from '../../../assets/Permission/Roll2.svg';
import Roll3 from '../../../assets/Permission/Roll3.svg';
import ActiveIcon from '../../../assets/common/Active.svg';
import RoleManagement from './RoleManagement';
import { usePermissionStore } from '../../../store/permissionStore';

interface PermissionUser {
  roleId: number;
  image: string;
  roleName: string;
  roleNameEn: string;
  description: string;
  roleUserCount: number;
  isActive: string;
}

//컴포넌트
const permissionData: PermissionUser[] = [
  {
    roleId: 1,
    image: Roll1,
    roleName: "관리자",
    roleNameEn: "Administrator",
    description: "시스템 관리 및 전체 권한 보유",
    roleUserCount: 1,
    isActive: "active",
  },
  {
    roleId: 2,
    image: Roll2,
    roleName: "편집자",
    roleNameEn: "Editor",
    description: "콘텐츠 관리, 편집 및 게시 권한",
    roleUserCount: 5,
    isActive: "active",
  },
  {
    roleId: 3,
    image: Roll3,
    roleName: "사용자",
    roleNameEn: "User",
    description: "기본 읽기 및 제한된 쓰기 권한",
    roleUserCount: 10,
    isActive: "active",
  }
];

const columns = [
  { key: 'roleName', label: '역할명', width: '22%' },
  { key: 'description', label: '설명', width: '32%' },
  { key: 'roleUserCount', label: '사용자 수', width: '14%' },
  { key: 'isActive', label: '상태', width: '14%' },
  { key: 'action', label: '작업', width: '14%' },
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
          <TableHeader>
            {columns.map((col, idx) => (
              <HeaderCell
                key={col.key}
                style={{ width: col.width, marginRight: idx === 0 ? '48px' : 0 }}
              >
                {col.label}
              </HeaderCell>
            ))}
          </TableHeader>
          <Divider />
          <TableBody>
            {permissionData.map((user) => (
              <TableRow key={user.roleId}>
                <BodyCell style={{ width: columns[0].width, justifyContent: 'flex-start', paddingLeft: '48px' }}>
                  <RoleImage src={user.image} alt={user.roleName} />
                  <NameTextBox>
                    <NameText>{user.roleName}</NameText>
                    <EngNameText>{user.roleNameEn}</EngNameText>
                  </NameTextBox>
                </BodyCell>
                <BodyCell style={{ width: columns[1].width, border: "none" }}>{user.description}</BodyCell>
                <BodyCell style={{ width: columns[2].width, border: "none"}}>{user.roleUserCount}명</BodyCell>
                <BodyCell style={{ width: columns[3].width, border: "none" }}>
                  <StatusIcon src={ActiveIcon} alt={user.isActive} />
                </BodyCell>
                <BodyCell style={{ width: columns[4].width }}>
                  <ActionText onClick={() => handleEditClick(user)}>수정</ActionText>
                </BodyCell>
              </TableRow>
            ))}
          </TableBody>
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
  margin-top: -32px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 0;
`;
const TableBox = styled.div`
  width: 1052px;
  background: var(--color-white);
  border-radius: 18.5px;
  box-shadow: 0px 0px 10.5px 2.1px rgba(153, 102, 204, 0.05);
  overflow: hidden;
`;
const TableHeader = styled.div`
  display: flex;
  width: 100%;
  padding: 24px 0 24px 0;
  background: transparent;
`;
const HeaderCell = styled.div`
  width: 100%;
  font-weight: 600;
  font-size: 18px;
  color: var(--color-black);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Divider = styled.div`
  width: 100%;
  border-top: 0.35px solid var(--color-darkgray);
  margin-bottom: 4px;
`;
const TableBody = styled.div`
  width: 100%;
`;
const TableRow = styled.div`
  display: flex;
  width: 100%;
  min-height: 72px;
  align-items: center;
  margin-bottom: 12px;
`;
const BodyCell = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 16.8px;
  color: var(--color-black);
  height: 72px;
  gap: 10px;
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
const RoleImage = styled.img`
  width: 33.6px;
  height: 33.6px;
  border-radius: 8.4px;
  background: #ffa800;
  object-fit: cover;
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
const StatusIcon = styled.img`
  width: 56px;
  height: 32px;
  object-fit: contain;
`; 