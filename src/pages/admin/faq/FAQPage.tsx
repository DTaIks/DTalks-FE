import styled from "styled-components";
import TitleContainer from "../../../layout/TitleContainer";
import FAQTable from "../../../components/admin/faq/FAQTable";

const FAQPage = () => {
  return (
    <Container>
      <TitleContainer title="FAQ 관리" subtitle="자주 묻는 질문들을 관리하고 편집하세요" />
      <FAQTable />
    </Container>
  );
};

export default FAQPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
