import React from 'react';
import styled from 'styled-components';
import { usePromptTemplate } from '@/query/useChartQueries';
import { LoadingState, ErrorState, NoDataState } from '@/components/admin/chart/ChartDataState';
import { DonutChart } from '@/components/admin/chart/DonutChartCard';
import type { DonutChartData } from '@/types/chart';
import '@/styles/Global.css';

export interface PromptTemplate {
  smallTalk: DonutChartData;
  qna: DonutChartData;
  formatSearch: DonutChartData;
  organization: DonutChartData;
}

interface PromptTemplateCardProps {
  data: PromptTemplate;
}

const donutChartConfigs = [
  { key: 'smallTalk', label: '일상 대화', pathColor: '#9B7EF7' },
  { key: 'qna', label: 'QnA', pathColor: '#9B7EF7' },
  { key: 'formatSearch', label: '양식 요청', pathColor: '#9B7EF7' },
  { key: 'organization', label: '조직도 조회', pathColor: '#9B7EF7' },
] as const;

const PromptTemplateCardContent: React.FC<PromptTemplateCardProps> = ({ data }) => {
  return (
    <>
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
    </>
  );
};

export const PromptTemplateCard: React.FC = () => {
  const { data, isLoading, error } = usePromptTemplate();

  if (isLoading) {
    return (
      <Container>
        <LoadingState message="프롬프트 템플릿 데이터를 불러오는 중" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorState 
          title="프롬프트 템플릿 데이터를 불러올 수 없습니다"
          message={error.message} 
        />
      </Container>
    );
  }

  if (!data) {
    return (
      <Container>
        <NoDataState message="프롬프트 템플릿 데이터가 없습니다" />
      </Container>
    );
  }

  return (
    <Container>
      <PromptTemplateCardContent data={data} />
    </Container>
  );
};

const Container = styled.div`
  flex-shrink: 0;
  width: 1062px;
  height: 336px;
  border-radius: 18.75px;
  background: var(--color-white);
  box-shadow: 0 6px 18px rgba(125, 93, 246, 0.1);
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
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
  flex: 1;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gap-20);
  justify-content: center;
  align-items: center;
  align-content: center;
  padding: 0 40px;
  box-sizing: border-box;
`;
