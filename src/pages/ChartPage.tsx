import React from 'react';
import styled from 'styled-components';

import StatCard from '../components/chart/StatCard';
import { ResponseTimeChart } from '../components/chart/ResponseTimeCard';
import { KeywordAnalysisCard } from '../components/chart/KeywordAnalysisCard';
import { PromptTemplateCard } from '../components/chart/PromptTemplateCard';
import WeeklyResponseCard from '../components/chart/WeeklyResponseCard';

import {
  useDailyChat,
  useSuccessRate,
  useSatisfaction,
  useResponseTime,
  usePromptTemplate,
  useKeyword,
  useWeeklyResponse,
} from '../hooks/useChart';

const ChartPage: React.FC = () => {
  const dailyChat = useDailyChat();
  const successRate = useSuccessRate();
  const satisfaction = useSatisfaction();
  const responseTime = useResponseTime();
  const promptTemplate = usePromptTemplate();
  const keyword = useKeyword();
  const weeklyResponse = useWeeklyResponse();

  const statCards = [
    { data: dailyChat },
    { data: successRate },
    { data: satisfaction }
  ];

  return (
    <PageContainer>
      <Header>
        <h1>통계</h1>
        <p>챗봇 성능 사용자 데이터를 분석하세요</p>
      </Header>

      <StatsContainer1>
        {statCards.map((card, index) => (
          <StatCard 
            key={index}
            data={card.data}
          />
        ))}
      </StatsContainer1>

      <ResponseTimeChart responseTime={responseTime} />

      <StatsContainer2>
        <PromptTemplateCard data={promptTemplate} />
        <KeywordAnalysisCard keyword={keyword} />
      </StatsContainer2>

      <WeeklyResponseCard data={weeklyResponse} />
    </PageContainer>
  );
};

export default ChartPage;

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--color-ghostwhite);
  padding: 183px 60px 120px 460px;
`;

const Header = styled.div`
  margin-bottom: 30px;

  h1 {
    color: #323232;
    font-size: var(--font-size-42);
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  p {
    color: #323232;
    font-size: var(--font-size-24);
    font-weight: 400;
    padding-bottom: 60px;
  }
`;

const StatsContainer1 = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-48);
  padding-bottom: 60px;
`;

const StatsContainer2 = styled.div`
  display: flex;
  gap: var(--gap-27);
  margin-top: 60px;
`;
