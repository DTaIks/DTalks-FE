import React from "react";
import styled from "styled-components";

const FAQTableHead: React.FC = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>질문</TableCell>
        <TableCell>카테고리</TableCell>
        <TableCell>상태</TableCell>
        <TableCell>최종 수정일</TableCell>
        <TableCell>작업</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default FAQTableHead;

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
  padding-left: 44px;
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: var(--table-header-color);
  font-size: var(--font-size-16);
  font-weight: 600;
  
  &:nth-child(1) { width: 370px; }
  &:nth-child(2) { width: 160px; margin-right:-40px; justify-content: center; }
  &:nth-child(3) { width: 180px; justify-content: center; }
  &:nth-child(4) { width: 190px; }
  &:nth-child(5) { width: 120px; }
`; 