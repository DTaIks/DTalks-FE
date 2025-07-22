import React from 'react';
import styled from 'styled-components';
import { DonutChart } from './DonutChartCard';
import '../../styles/Global.css';

export interface DonutChart {
  value: number;
  count: number;
}

export interface PromptTemplate {
  totalUse: number;
  averageResponseTime: number;
  smallTalk: DonutChart;
  dbBased: DonutChart;
  keyValueBased: DonutChart;
  error: DonutChart;
}

interface PromptTemplateCardProps {
  data: PromptTemplate;
}

const donutChartConfigs = [
  { key: 'smallTalk', label: 'Small Talk', pathColor: '#9B7EF7' },
  { key: 'dbBased', label: 'DB Based', pathColor: '#9B7EF7' },
  { key: 'keyValueBased', label: 'Key-Value Based', pathColor: '#9B7EF7' },
  { key: 'error', label: 'Error', pathColor: '#9B7EF7' },
] as const;

export const PromptTemplateCard: React.FC<PromptTemplateCardProps> = ({ data }) => {

  return (
    <Container>
      <CardHeader>
        <CardTitle>프롬프트 템플릿 사용 통계</CardTitle>
      </CardHeader>

      <DonutGrid>
        {donutChartConfigs.map(({ key, pathColor }) => {
          const chartData = data[key];
          return (
            <DonutChart
              key={key}
              type={key}
              value={chartData.value}
              count={chartData.count}
              pathColor={pathColor}
              size="140px"
            />
          );
        })}
      </DonutGrid>
    </Container>
  );
};

const Container = styled.div`
  flex-shrink: 0;
  width: 695px;
  height: 720px;
  border-radius: var(--br-25);
  background: var(--color-white);
  box-shadow: 0 8px 24px rgba(125, 93, 246, 0.1);
`;

const CardHeader = styled.div`
  width: 100%;
  height: 98px;
  border-radius: 26px 26px 0 0;
  border-bottom: 2px solid #e9e0f0;
  background: var(--color-white);
`;

const CardTitle = styled.h1`
  padding: 32px 381px 35px 48px;
  font-size: var(--font-size-26);
  font-weight: 600;
  color: var(--color-black);
`;

const DonutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--gap-24);
  padding: var(--padding-36);
  justify-items: center;
  align-items: center;
`;
