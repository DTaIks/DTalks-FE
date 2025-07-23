import React from 'react';
import styled from 'styled-components';

export interface StatCard {
  title: string;
  value: number;
  increase: number;
  unit?: string;
  compareWith?: string;
}

interface StatCardProps {
  data: StatCard;
}

// 증감에 따른 텍스트와 색상 변환
function getChange(increase: number, compareWith: string = '이전 대비') {
  const isPositive = increase > 0;
  const prefix = isPositive ? '+' : '';
  const text = `${prefix}${increase}% ${compareWith}`;
  const color = isPositive ? '#22C55D' : '#EF4444';

  return { text, color };
}

function formatStatValue(value: number, unit: string = ''): string {
  return `${value.toLocaleString()}${unit}`;
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const { title, value, increase, unit = '', compareWith = '이전 대비' } = data;

  const formatValue = formatStatValue(value, unit);
  const change = getChange(increase, compareWith);

  return (
    <Card>
      <Content>
        <Title>{title}</Title>
        <Value>{formatValue}</Value>
        <ChangeIndicator color={change.color}>
          {change.text}
        </ChangeIndicator>
      </Content>
    </Card>
  );
};

export default StatCard;

const Card = styled.div`
  width: 440px;
  height: 300px;
  flex-shrink: 0;
  border-radius: var(--br-25);
  background: var(--color-white);
  box-shadow: 0px 0px 15px 3px rgba(153, 102, 204, 0.05);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  padding: 0 48px;
  box-sizing: border-box;
  text-align: left;
  padding-bottom: 36px;
`;

const Title = styled.p`
  color: var(--color-black);
  font-size: var(--font-size-26);
  font-weight: 500;
  margin-bottom: 18px;
`;

const Value = styled.div`
  color: var(--color-black);
  font-size: var(--font-size-42);
  font-weight: 700;
  margin: 0;
`;

const ChangeIndicator = styled.div<{ color: string }>`
  color: ${props => props.color};
  font-size: var(—font-size-26);
  font-weight: 500;
  margin-top: 12px;
`;
