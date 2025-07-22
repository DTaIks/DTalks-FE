import styled from "styled-components";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import '../../styles/Global.css';

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
  width: 300px;
  height: 250px;
  flex-shrink: 0;
  border-radius: var(--br-25);
  background: var(--color-white);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Title = styled.h3`
  color: var(--color-black);
  font-size: var(--font-size-28);
  font-weight: 600;
  position: absolute;
  top: 24px;
  left: 44px;
  margin: 0;
`;

const Wrapper = styled.div<{ $size: string }>`
  position: relative;
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  padding: 69px 0 31px 0;
`;

const Content = styled.div`
  position: absolute;
  top: calc(50% + 19px);
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-black);
  text-align: center;
`;

const Percentage = styled.div`
  font-size: var(--font-size-28);
  font-weight: 700;
`;

const Count = styled.div`
  font-size: var(--font-size-20);
  font-weight: 500;
  margin-top: 6px;
`;
