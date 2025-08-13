import React from 'react';
import styled from 'styled-components';
import { useDailyChat, useSuccessRate, useSatisfaction } from '@/query/useChartQueries';
import { LoadingState, ErrorState, NoDataState } from '@/components/admin/chart/ChartDataState';

export interface StatCard {
  title: string;
  value: number;
  increase: number;
  unit?: string;
  compareWith?: string;
}

interface StatCardProps {
  data?: StatCard;
  isLoading?: boolean;
  error?: Error | null;
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

const StatCard: React.FC<StatCardProps> = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <Card>
        <Content $centered>
          <LoadingState message="데이터를 불러오는 중" />
        </Content>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Content $centered>
          <ErrorState 
            title="데이터를 불러올 수 없습니다"
            message={error.message}
          />
        </Content>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <Content $centered>
          <NoDataState message="데이터가 없습니다" />
        </Content>
      </Card>
    );
  }

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

// StatCard 컴포넌트들
export const DailyChatCard: React.FC = () => {
  const { data, isLoading, error } = useDailyChat();
  return <StatCard data={data} isLoading={isLoading} error={error} />;
};

export const SuccessRateCard: React.FC = () => {
  const { data, isLoading, error } = useSuccessRate();
  return <StatCard data={data} isLoading={isLoading} error={error} />;
};

export const SatisfactionCard: React.FC = () => {
  const { data, isLoading, error } = useSatisfaction();
  return <StatCard data={data} isLoading={isLoading} error={error} />;
};

export default StatCard;

const Card = styled.div`
  width: 330px;
  height: 210px;
  flex-shrink: 0;
  border-radius: var(--br-25);
  background: var(--color-white);
  box-shadow: 0px 0px 11.25px 2.25px rgba(153, 102, 204, 0.05);
`;

const Content = styled.div<{ $centered?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$centered ? 'center' : 'flex-start'};
  justify-content: center;
  height: 100%;
  padding: 0 36px;
  box-sizing: border-box;
  text-align: ${props => props.$centered ? 'center' : 'left'};
  padding-bottom: ${props => props.$centered ? '0' : '27px'};
`;

const Title = styled.p`
  color: var(--color-black);
  font-size: var(--font-size-20);
  font-weight: 500;
  margin-bottom: 13.5px;
`;

const Value = styled.div`
  color: var(--color-black);
  font-size: var(--font-size-32);
  font-weight: 700;
  margin: 0;
`;

const ChangeIndicator = styled.div<{ color: string }>`
  color: ${props => props.color};
  font-size: var(--font-size-20);
  font-weight: 500;
  margin-top: 9px;
`;
