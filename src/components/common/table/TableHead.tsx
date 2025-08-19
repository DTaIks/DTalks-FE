import React from "react";
import styled from "styled-components";

interface TableHeadProps {
  headers: string[];
}

const TableHead: React.FC<TableHeadProps> = ({ headers }) => {
  return (
    <Head>
      <TableRow>
        {headers.map((header, index) => (
          <TableCell key={index}>{header}</TableCell>
        ))}
      </TableRow>
    </Head>
  );
};

export default TableHead;

const Head = styled.div`
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
  color: var(--table-header-color);
  font-size: var(--font-size-16);
  font-weight: 600;
  
  &:nth-child(1) { width: 260px; }
  &:nth-child(2) { width: 170px; justify-content: center; }
  &:nth-child(3) { width: 110px; }
  &:nth-child(4) { width: 120px; }
  &:nth-child(5) { width: 180px; }
  &:nth-child(6) { width: 90px; justify-content: center; }
  &:nth-child(7) { width: 90px; justify-content: center; }
`;
