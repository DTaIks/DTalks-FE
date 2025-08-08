import React from "react";
import styled from "styled-components";

interface TableCellProps {
  children: React.ReactNode;
  width?: string;
  justifyContent?: string;
}

const TableCell: React.FC<TableCellProps> = ({ 
  children, 
  width, 
  justifyContent = "flex-start" 
}) => {
  return (
    <Cell width={width} justifyContent={justifyContent}>
      {children}
    </Cell>
  );
};

export default TableCell;

const Cell = styled.div<{ width?: string; justifyContent?: string }>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justifyContent};
  color: var(--table-header-color);
  font-size: var(--font-size-16);
  font-weight: 500;
  width: ${props => props.width || 'auto'};
  
  &:nth-child(1) { width: 200px; }
  &:nth-child(2) { width: 200px; justify-content: center; }
  &:nth-child(3) { width: 110px; }
  &:nth-child(4) { width: 110px; }
  &:nth-child(5) { width: 190px; }
  &:nth-child(6) { width: 110px; justify-content: center; }
  &:nth-child(7) { width: 110px; justify-content: center; }
`;
