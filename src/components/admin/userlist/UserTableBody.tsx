import React from "react";
import styled from "styled-components";
import type { User } from "@/types/user";

import UserTableRow from "@/components/admin/userlist/UserTableRow";

interface UserTableBodyProps {
  users: User[];
}

const UserTableBody: React.FC<UserTableBodyProps> = ({ users }) => {
  return (
    <TableBody>
      {users.map((user) => (
        <UserTableRow key={user.userId} user={user} />
      ))}
    </TableBody>
  );
};

export default UserTableBody;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 28px;
`;
