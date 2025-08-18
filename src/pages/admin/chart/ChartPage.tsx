import React from 'react';
import styled from 'styled-components';
import TitleContainer from '@/layout/TitleContainer';
import { DailyChatCard, SuccessRateCard, SatisfactionCard } from '@/components/admin/chart/StatCard';
import { ResponseTimeChart } from '@/components/admin/chart/ResponseTimeCard';
import { PromptTemplateCard } from '@/components/admin/chart/PromptTemplateCard';
import WeeklyResponseCard from '@/components/admin/chart/WeeklyResponseCard';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const ChartPage: React.FC = () => {
  useScrollToTop();
  
  return (
    <Container>
      <HeaderWrapper>
        <TitleContainer title="통계" subtitle="챗봇 성능과 사용자 데이터를 분석하세요"/>
      </HeaderWrapper>
      <ContentArea>
        <StatCardsContainer>
          <DailyChatCard />
          <SuccessRateCard />
          <SatisfactionCard />
        </StatCardsContainer>

        <PromptTemplateCard />

        <ResponseTimeChart />

        <WeeklyResponseCard />
      </ContentArea>
    </Container>
  );
};

export default ChartPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  position: relative;
  width: 1056px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 32px;
`;

const ContentArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatCardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-36);
  padding-bottom: 46.6px;
`;
