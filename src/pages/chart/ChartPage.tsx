import React from 'react';
import TitleContainer from '../../layout/TitleContainer';
import StatCard from '../../components/chart/StatCard';
import { ResponseTimeChart } from '../../components/chart/ResponseTimeCard';
import { KeywordAnalysisCard } from '../../components/chart/KeywordAnalysisCard';
import { PromptTemplateCard } from '../../components/chart/PromptTemplateCard';
import WeeklyResponseCard from '../../components/chart/WeeklyResponseCard';

import {
  useDailyChat,
  useSuccessRate,
  useSatisfaction,
  useResponseTime,
  usePromptTemplate,
  useKeyword,
  useWeeklyResponse,
} from '../../hooks/useChart';

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
    <>
      <TitleContainer title="통계" subtitle="챗봇 성능과 사용자 데이터를 분석하세요" />
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--gap-36)", paddingBottom: 46.6 }}>
          {statCards.map((card, index) => (
            <StatCard 
              key={index}
              data={card.data}
            />
          ))}
        </div>

        <ResponseTimeChart responseTime={responseTime} />

        <div style={{ display: "flex", gap: "var(--gap-20)", marginTop: 60 }}>
          <PromptTemplateCard data={promptTemplate} />
          <KeywordAnalysisCard keyword={keyword} />
        </div>

        <WeeklyResponseCard data={weeklyResponse} />
      </div>
    </>
  );
};

export default ChartPage;
