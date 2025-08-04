import styled from "styled-components";
import TitleContainer from "../../../layout/TitleContainer";

const DocumentPage = () => {
  return (
    <Container>
      <TitleContainer title="전체 문서" subtitle="모든 사내 문서를 한 번에 확인하고 정리하세요" />
      {/* DocumentTable 컴포넌트가 여기에 들어갈 예정 */}
    </Container>
  );
};

export default DocumentPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
`; 