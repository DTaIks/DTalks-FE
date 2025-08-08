import styled from "styled-components";

const UserTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>이름</TableCell>
        <TableCell>부서</TableCell>
        <TableCell>역할</TableCell>
        <TableCell>이메일</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default UserTableHead;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: var(--table-header-color);
  font-size: var(--font-size-16);
  font-weight: 600;
  
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

const TableRow = styled.div`
  width: 989.33px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
  padding-left: 36px;
`;

const TableHead = styled.div`
  height: 60px;
  border-bottom: 1.5px solid #E9E0F0;
  background: #FFF;
  display: flex;
  align-items: center;
  font-weight: 600;
`; 