import styled from "styled-components";
import TitleContainer from "../../../layout/TitleContainer";
import FAQCategoryTable from "../../../components/admin/faq/FAQCategoryTable";

const FAQCategoryPage = () => {
  return (
    <Container>
      <TitleContainer title="FAQ 카테고리 관리" subtitle="FAQ 카테고리를 관리하고 편집하세요" />
      <FAQCategoryTable />
    </Container>
  );
};

export default FAQCategoryPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
`; 