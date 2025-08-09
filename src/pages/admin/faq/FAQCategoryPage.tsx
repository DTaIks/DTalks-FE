import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import FAQCategoryTable from "@/components/admin/faq/category/FAQCategoryTable";

const FAQCategoryPage = () => {
  return (
    <Container>
      <HeaderWrapper>
        <TitleContainer title="FAQ 카테고리 관리" subtitle="FAQ 카테고리를 관리하고 편집하세요" />
      </HeaderWrapper>
      <FAQCategoryTable />
    </Container>
  );
};

export default FAQCategoryPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  position: relative;
  width: 1056px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 32px;
`; 