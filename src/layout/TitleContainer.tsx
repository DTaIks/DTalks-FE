import styled from "styled-components";

interface TitleContainerProps {
  title: string;
  subtitle?: string;
}

const TitleContainer = ({ title, subtitle }: TitleContainerProps) => {
  return (
    <Container>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Container>
  );
};

export default TitleContainer;

const Container = styled.div`
  position: absolute;
  top: 40px;
  left: 255px;
  width: 1056.75px;
  height: 65.25px;
  font-size: 31.5px;
  margin-left: 45px;
  color: var(--color-darkslategray);
`;

const Title = styled.b`
  position: absolute;
  top: 0px;
  left: 0px;
  font-size: var(--font-size-30);
`;

const Subtitle = styled.div`
  position: absolute;
  top: 43.5px;
  left: 0px;
  font-size: var(--font-size-18);
`; 