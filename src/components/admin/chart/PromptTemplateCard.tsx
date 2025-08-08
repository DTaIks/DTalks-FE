import React from 'react';
import styled from 'styled-components';
import { DonutChart } from '@/components/admin/chart/DonutChartCard';
import '@/styles/Global.css';

export interface DonutChart {
  value: number;
  count: number;
}

export interface PromptTemplate {
  totalUse: number;
  averageResponseTime: number;
  smallTalk: DonutChart;
  qna: DonutChart;
  formatSearch: DonutChart;
  organization: DonutChart;
}

interface PromptTemplateCardProps {
  data: PromptTemplate;
}

const donutChartConfigs = [
  { key: 'smallTalk', label: 'Small Talk', pathColor: '#9B7EF7' },
  { key: 'qna', label: 'QnA', pathColor: '#9B7EF7' },
  { key: 'formatSearch', label: 'Format Search', pathColor: '#9B7EF7' },
  { key: 'organization', label: 'Organization ', pathColor: '#9B7EF7' },
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
              size="120px"
            />
          );
        })}
      </DonutGrid>
    </Container>
  );
};

const Container = styled.div`
  flex-shrink: 0;
  width: 521.25px;
  height: 540px;
  border-radius: 18.75px;
  background: var(--color-white);
  box-shadow: 0 6px 18px rgba(125, 93, 246, 0.1);
`;

const CardHeader = styled.div`
  width: 100%;
  height: 76px;
  border-radius: 19.5px 19.5px 0 0;
  border-bottom: 1.5px solid #e9e0f0;
  background: var(--color-white);
  display: flex;
  align-items: center; 
  padding: 0 36px;
  box-sizing: border-box;
`;

const CardTitle = styled.h1`
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-600);
  color: var(--color-black);
  white-space: nowrap;
  margin: 0;
`;

const DonutGrid = styled.div`
  display: grid;
  height: 452.15px;
  grid-template-columns: 225px 225px; 
  gap: var(--gap-20);
  justify-content: center;
  align-items: center;
  align-content: center;
`;