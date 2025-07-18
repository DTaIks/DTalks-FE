import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 156px;
  left: 458px;
  width: 1409px;
  height: 87px;
  font-size: 42px;
  color: var(--color-darkslategray);
`;

const Title = styled.b`
  position: absolute;
  top: 0px;
  left: 0px;
`;

const Subtitle = styled.div`
  position: absolute;
  top: 58px;
  left: 0px;
  font-size: var(--font-size-24);
`;

const UserTitleContainer = () => {
  return (
    <Container>
      <Title>사용자 목록</Title>
      <Subtitle>등록한 사용자들을 관리하세요</Subtitle>
    </Container>
  );
};

export default UserTitleContainer; 