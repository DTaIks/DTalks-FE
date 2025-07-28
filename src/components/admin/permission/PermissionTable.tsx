import { useState } from "react";
import styled from "styled-components";
import Roll1 from '../../../assets/permission/Roll.svg';
import Roll2 from '../../../assets/permission/Roll2.svg';
import Roll3 from '../../../assets/permission/Roll3.svg';
import ActiveIcon from '../../../assets/Permission/Active.svg';

interface PermissionUser {
  id: number;
  image: string;
  name: string;
  engName: string;
  description: string;
  userCount: string;
  status: string;
}

const permissionData: PermissionUser[] = [
  {
    id: 1,
    image: Roll1,
    name: "관리자",
    engName: "Administrator",
    description: "시스템 관리 및 전체 권한 보유",
    userCount: "1명",
    status: "active",
  },
  {
    id: 2,
    image: Roll2,
    name: "편집자",
    engName: "Editor",
    description: "콘텐츠 관리, 편집 및 게시 권한",
    userCount: "5명",
    status: "active",
  },
  {
    id: 3,
    image: Roll3,
    name: "사용자",
    engName: "User",
    description: "기본 읽기 및 제한된 쓰기 권한",
    userCount: "10명",
    status: "active",
  }
];

const columns = [
  { key: 'name', label: '역할명', width: '22%' },
  { key: 'description', label: '설명', width: '32%' },
  { key: 'userCount', label: '사용자 수', width: '14%' },
  { key: 'status', label: '상태', width: '14%' },
  { key: 'action', label: '작업', width: '14%' },
];

const PermissionTable = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
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
              <TableRow key={user.id}>
                <BodyCell style={{ width: columns[0].width, justifyContent: 'flex-start', paddingLeft: '48px' }}>
                  <RoleImage src={user.image} alt={user.name} />
                  <NameTextBox>
                    <NameText>{user.name}</NameText>
                    <EngNameText>{user.engName}</EngNameText>
                  </NameTextBox>
                </BodyCell>
                <BodyCell style={{ width: columns[1].width, border: "none" }}>{user.description}</BodyCell>
                <BodyCell style={{ width: columns[2].width, border: "none"}}>{user.userCount}</BodyCell>
                <BodyCell style={{ width: columns[3].width, border: "none" }}>
                  <StatusIcon src={ActiveIcon} alt={user.status} />
                </BodyCell>
                <BodyCell style={{ width: columns[4].width }}>
                  <ActionText onClick={handleEditClick}>수정</ActionText>
                </BodyCell>
              </TableRow>
            ))}
          </TableBody>
        </TableBox>
      </TableWrapper>

      {isEditModalOpen && (
        <EditModalOverlay>
          <EditModalContainer>
            <EditModalCloseButton onClick={handleEditModalClose}>×</EditModalCloseButton>
            <EditModalContent>
              <EditModalTitle>역할 수정</EditModalTitle>
              <EditModalBody>
                <p>역할 수정 내용이 여기에 들어갑니다.</p>
              </EditModalBody>
            </EditModalContent>
          </EditModalContainer>
        </EditModalOverlay>
      )}
    </>
  );
};

export default PermissionTable;

const EditModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const EditModalContainer = styled.div`
  width: 868px;
  height: 678px;
  background: #FFF;
  border-radius: 19.5px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const EditModalCloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 32px;
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  z-index: 1;
`;

const EditModalContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const EditModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 2rem 0;
`;

const EditModalBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TableWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 0;
`;
const TableBox = styled.div`
  width: 1052.25px;
  background: var(--color-white);
  border-radius: 17.5px;
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
  font-size: 16.8px;
  color: var(--color-dimgray);
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
  width: 52.5px;
  height: 29.4px;
  object-fit: contain;
`; 