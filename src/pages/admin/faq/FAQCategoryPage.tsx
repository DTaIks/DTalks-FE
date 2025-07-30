import styled from "styled-components";
import FAQCategoryTable from "../../../components/admin/faq/FAQCategoryTable";

const FAQCategoryPage = () => {
  return (
    <Container>
      <FAQCategoryTable />
    </Container>
  );
};

export default FAQCategoryPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
`; 