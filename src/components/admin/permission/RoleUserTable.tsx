import styled from 'styled-components';
import { usePermissionStore } from '@/store/permissionStore';

interface UserTableProps {
  tableHeaders: string[];
  tableData: Array<{
    userId: number; 
    name: string;
    email: string;
    department: string;
    role: string;
  }>;
}

const UserTable = ({ tableHeaders, tableData }: UserTableProps) => {
  const { selectedUserIds, toggleSelectedUserId } = usePermissionStore();

  return (
    <UserTableContainer>
      <TableHeader>
        {tableHeaders.map((header, index) => (
          <HeaderCell key={index} columnIndex={index}>{header}</HeaderCell>
        ))}
      </TableHeader>
      <TableBody>
        {tableData.map((row) => (
          <TableRow 
            key={row.userId}
            selected={selectedUserIds.includes(row.userId)} 
            onClick={() => toggleSelectedUserId(row.userId)}
          >
            <TableCell columnIndex={0}>{row.name}</TableCell>
            <TableCell columnIndex={1}>{row.email}</TableCell>
            <TableCell columnIndex={2}>{row.department}</TableCell>
            <TableCell columnIndex={3}>{row.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </UserTableContainer>
  );
};

export default UserTable;

const UserTableContainer = styled.div`
  width: 100%;
  margin-top: 24px;
`;

const TableHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #E9E0F0;
  padding-bottom: 12px;
  margin-bottom: 8px;
`;

const HeaderCell = styled.div<{ columnIndex: number }>`
  color: #000;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  margin-top: -10px;
  
  ${props => {
    switch (props.columnIndex) {
      case 0: 
        return `
          flex: 1;
          padding-left: 36px;
        `;
      case 1:
        return `
          flex: 2;
        `;
      case 2:
        return `
          flex: 0.8;
          padding-left: 36px;
        `;
      case 3: 
        return `
          flex: 0.85;
        `;
      default:
        return 'flex: 1;';
    }
  }}
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TableRow = styled.div<{ selected?: boolean }>`
  display: flex;
  padding: 12px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  
  ${props => props.selected && `
    border: 1px solid #764ba2;
    background-color: rgba(118, 75, 162, 0.03);
    box-shadow: 0 2px 8px rgba(118, 75, 162, 0.1);
  `}
`;

const TableCell = styled.div<{ columnIndex: number }>`
  color: #000;
  font-size: 16px;
  text-align: left;
  
  ${props => {
    switch (props.columnIndex) {
      case 0: 
        return `
          flex: 1;
          padding-left: 36px;
        `;
      case 1: 
        return `
          flex: 2;
        `;
      case 2: 
        return `
          flex: 0.8;
          padding-left: 36px;
        `;
      case 3: 
        return `
          flex: 0.85;
        `;
      default:
        return 'flex: 1;';
    }
  }}
`;
