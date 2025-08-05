import React from "react";
import styled from "styled-components";

const DocumentTableHead: React.FC = () => {
  const columnHeaders = [
    "문서명",
    "카테고리", 
    "버전",
    "작성자",
    "최종 수정일",
    "상태",
    "작업"
  ];

  return (
    <TableHead>
      <TableRow>
        {columnHeaders.map((header, index) => (
          <TableCell key={index}>{header}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default DocumentTableHead;

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
  color: #2D1457;
  font-size: var(--font-size-16);
  font-weight: 500;
  
  &:nth-child(1) { width: 200px; }
  &:nth-child(2) { width: 200px; justify-content: center; }
  &:nth-child(3) { width: 110px; }
  &:nth-child(4) { width: 110px; }
  &:nth-child(5) { width: 190px; }
  &:nth-child(6) { width: 110px; justify-content: center; }
  &:nth-child(7) { width: 110px; justify-content: center; }
`; 