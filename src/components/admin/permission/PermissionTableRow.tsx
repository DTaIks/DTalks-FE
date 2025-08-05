import styled from "styled-components";
import ActiveIcon from "@/assets/common/Active.svg";
import type { PermissionUser } from "@/types/permission";

interface TableRowProps {
  user: PermissionUser;
  onEditClick: (user: PermissionUser) => void;
}

const TableRow = ({ user, onEditClick }: TableRowProps) => {
  return (
    <RowContainer>
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
        <ActionText onClick={() => onEditClick(user)}>수정</ActionText>
      </TableCell>
    </RowContainer>
  );
};

export default TableRow;

const RowContainer = styled.div`
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