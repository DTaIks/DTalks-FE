import styled from "styled-components";
import FAQTable from "../../../components/admin/faq/FAQTable";

const FAQPage = () => {
  return (
    <Container>
      <FAQTable />
    </Container>
  );
};

export default FAQPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
