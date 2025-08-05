import styled from "styled-components";

const FAQCategoryTableHeader = () => {
  return (
    <TableHeader>
      <TableTitle>카테고리 목록</TableTitle>
    </TableHeader>
  );
};

export default FAQCategoryTableHeader;

const TableHeader = styled.div`
  width: 1062px;
  height: 76px;
  border-radius: 19.5px 19.5px 0 0;
  border-bottom: 1.5px solid #E9E0F0;
  background: var(--color-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 36px;
`;

const TableTitle = styled.h2`
  color: #000;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`; 