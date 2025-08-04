import styled from "styled-components";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import '../../../styles/Global.css';

// 프롬프트 템플릿 종류
const TEMPLATE_TYPES = {
  smallTalk: 'Small Talk',
  dbBased: 'DB Based',
  keyValueBased: 'Key-Value Based',
  error: 'Error',
} as const;

export interface DonutChartProps {
  type: keyof typeof TEMPLATE_TYPES;
  size?: string;
  value?: number;
  count?: number;
  pathColor?: string;
  trailColor?: string;
}

export const DonutChart = ({
  type,
  size = "150px",
  value = 0,
  count = 0,
  pathColor = "#A981D6",
  trailColor = "#F5F5F5",
}: DonutChartProps) => {
  const title = TEMPLATE_TYPES[type] || '템플릿';

  const style = buildStyles({
    pathColor,
    trailColor,
    rotation: 0.5,
  });

  return (
    <Container>
      <Title>{title}</Title>
      <Wrapper $size={size}>
        <CircularProgressbar
          value={value}
          text=""
          strokeWidth={10}
          styles={style}
        />
        <Content>
          <Percentage>{value}%</Percentage> 
          <Count>{count}건</Count>
        </Content>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 225px;
  height: 187.5px;
  flex-shrink: 0;
  border-radius: 18.75px;
  background: var(--color-white);
  box-shadow: 0px 0px 7.5px 0px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Title = styled.h3`
  color: var(--color-black);
  font-size: var(--font-size-18);
  font-weight: 600;
  position: absolute;
  top: 18px;
  left: 33px;
  margin: 0;
`;

const Wrapper = styled.div<{ $size: string }>`
  position: relative;
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  padding: 51.75px 0 23.25px 0;
`;

const Content = styled.div`
  position: absolute;
  top: calc(50% + 14.25px);
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-black);
  text-align: center;
`;

const Percentage = styled.div`
  font-size: var(--font-size-21);
  font-weight: 700;
`;

const Count = styled.div`
  font-size: var(--font-size-15);
  font-weight: 500;
  margin-top: 4.5px;
`;
