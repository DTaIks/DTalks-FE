import styled from "styled-components";

const FAQCategoryTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>카테고리명</TableCell>
        <TableCell>설명</TableCell>
        <TableCell>상태</TableCell>
        <TableCell>FAQ 수</TableCell>
        <TableCell>작업</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default FAQCategoryTableHead;

const TableHead = styled.div`
  height: 60px;
  border-bottom: 1.5px solid #E9E0F0;
  background: #FFF;
  display: flex;
  align-items: center;
`;

const TableRow = styled.div`
  width: 1062px;
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
  
  &:nth-child(1) { width: 200px; }
  &:nth-child(2) { width: 380px; }
  &:nth-child(3) { width: 220px; justify-content: center; }
  &:nth-child(4) { width: 125px; }
  &:nth-child(5) { width: 125px; }
`; 