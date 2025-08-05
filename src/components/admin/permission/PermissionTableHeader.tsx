import styled from "styled-components";

const TableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>역할명</TableCell>
        <TableCell>설명</TableCell>
        <TableCell>사용자 수</TableCell>
        <TableCell>상태</TableCell>
        <TableCell>작업</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;

const TableHead = styled.div`
  height: 60px;
  border-bottom: 1.5px solid #E9E0F0;
  background: #FFF;
  display: flex;
  align-items: center;
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