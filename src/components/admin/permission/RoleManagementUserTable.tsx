import styled from 'styled-components';
import { usePermissionStore } from '@/store/permissionStore';

interface UserTableProps {
  tableHeaders: string[];
  tableData: Array<{
    name: string;
    email: string;
    department: string;
    role: string;
  }>;
}

const UserTable = ({ tableHeaders, tableData }: UserTableProps) => {
  const { selectedRows, toggleSelectedRow } = usePermissionStore();

  return (
    <UserTableContainer>
      <TableHeader>
        {tableHeaders.map((header, index) => (
          <HeaderCell key={index}>{header}</HeaderCell>
        ))}
      </TableHeader>
      <TableBody>
        {tableData.map((row, index) => (
          <TableRow 
            key={index}
            selected={selectedRows.includes(index)}
            onClick={() => toggleSelectedRow(index)}
          >
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.department}</TableCell>
            <TableCell>{row.role}</TableCell>
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

const HeaderCell = styled.div`
  flex: 1;
  color: #000;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  margin-top: -10px;
  
  &:first-child {
    padding-left: 36px;
  }
  
  &:nth-child(3) {
    padding-left: 36px;
  }
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

const TableCell = styled.div`
  flex: 1;
  color: #000;
  font-size: 16px;
  text-align: left;
  
  &:first-child {
    padding-left: 36px;
  }
  
  &:nth-child(3) {
    padding-left: 36px;
  }
`; 