import styled from "styled-components";
import TitleContainer from "../../../layout/TitleContainer";
import FAQTable from "../../../components/admin/faq/FAQTable";
import Button from "../../../components/common/Button";

const FAQPage = () => {
  return (
    <Container>
      <TitleContainer title="FAQ 관리" subtitle="자주 묻는 질문들을 관리하고 편집하세요" />
      <ButtonContainer>
        <StyledFAQButton text="FAQ 추가" width="var(--button-width)" height="var(--button-height)" />
      </ButtonContainer>
      <FAQTable />
    </Container>
  );
};

export default FAQPage;

// Styled Components - 파일 하단에 배치
const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: var(--gap-60);
  right: var(--gap-60);
`;

const StyledFAQButton = styled(Button)`
  && {
    color: var(--color-white);
    font-family: var(--font-pretendard);
    font-size: var(--font-size-18);
    font-style: normal;
    font-weight: var(--table-header-font-weight);
    line-height: normal;
  }
`;
