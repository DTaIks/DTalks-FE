import styled from "styled-components";

interface TitleContainerProps {
  title: string;
  subtitle?: string;
  marginLeft?: string;
}

const TitleContainer = ({ title, subtitle, marginLeft }: TitleContainerProps) => {
  return (
    <Container marginLeft={marginLeft}>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Container>
  );
};

export default TitleContainer;

const Container = styled.div<{ marginLeft?: string }>`
  position: absolute;
  top: 40px;
  left: calc(50% + 128px);
  transform: translateX(-50%);
  width: 1056px;
  height: 64px;
  font-size: 31.5px;
  margin-left: ${props => props.marginLeft || '0px'};
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