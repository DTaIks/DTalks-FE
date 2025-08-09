import React from "react";
import styled from "styled-components";
import type { User } from "@/types/user"; 

interface UserTableRowProps {
  user: User;
}

const UserTableRow: React.FC<UserTableRowProps> = ({ user }) => {
  return (
    <TableRow>
      <TableCell>
        <NameText>{user.userName}</NameText>
      </TableCell>
      <TableCell>
        <DepartmentText>{user.department}</DepartmentText>
      </TableCell>
      <TableCell>
        <RoleText>{user.role}</RoleText>
      </TableCell>
      <TableCell>
        <EmailText>{user.email}</EmailText>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;

const TableRow = styled.div`
  width: 989.33px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
  padding-left: 36px;
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #000;
  font-size: var(--font-size-16);
  font-weight: 500;
  
  &:nth-child(1) {
    width: 25%;
  }
  
  &:nth-child(2) {
    width: 25%;
  }
  
  &:nth-child(3) {
    width: 25%;
  }
  
  &:nth-child(4) {
    width: 40%;
  }
`;

const NameText = styled.span`
  color: var(--color-black);
  font-size: 16px;
  font-weight: 500;
`;

const DepartmentText = styled.span`
  color: var(--color-black);
  font-size: 16px;
  font-weight: 500;
`;

const RoleText = styled.span`
  color: var(--color-black);
  font-size: 16px;
  font-weight: 500;
`;

const EmailText = styled.span`
  color: var(--color-black);
  font-size: 16px;
  font-weight: 500;
`;
