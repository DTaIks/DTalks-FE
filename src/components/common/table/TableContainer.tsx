import React from "react";
import styled from "styled-components";

interface TableContainerProps {
  children: React.ReactNode;
}

const TableContainer: React.FC<TableContainerProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default TableContainer;

const Container = styled.div`
  width: 1062px;
  border-radius: var(--br-18);
  background: var(--color-white);
  box-shadow: 0 6px 18px 0 rgba(125, 93, 246, 0.10);
  transition: height 0.3s ease;
`;
