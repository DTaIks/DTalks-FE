import type { StatCard } from '@/components/admin/chart/StatCard';
import type { ResponseTime } from '@/components/admin/chart/ResponseTimeCard';
import type { PromptTemplate } from '@/components/admin/chart/PromptTemplateCard';
import type { Keyword } from '@/components/admin/chart/KeywordAnalysisCard';
import type { WeeklyResponse } from '@/components/admin/chart/WeeklyResponseCard';

export const useDailyChat = (): StatCard => {
  return {
    title: '일일 대화 수',
    value: 2847,
    increase: 18,
    unit: '개',
    compareWith: '어제 대비'
  };
};

export const useSuccessRate = (): StatCard => {
  return {
    title: '답변 성공률',
    value: 89.2,
    increase: 3.5,
    unit: '%',
    compareWith: '지난주 대비'
  };
};

export const useSatisfaction = (): StatCard => {
  return {
    title: '사용자 만족도 (좋아요)',
    value: 70.2,
    increase: -0.2,
    unit: '%',
    compareWith: '지난주 대비'
  };
};

export const useResponseTime = (): ResponseTime => {
  return {
    avg: 2.3,
    zones: [1247, 658, 234, 78, 150]
  };
};

export const usePromptTemplate = (): PromptTemplate => {
  return {
    totalUse: 8107,
    averageResponseTime: 1.8,
    smallTalk: { value: 87, count: 2657 },
    qna: { value: 50, count: 1589 },
    formatSearch: { value: 17, count: 735 },
    organization: { value: 5, count: 201 }
  };
};

export const useKeyword = (): Keyword => {
  return {
    count: 11504,
    keywords: ['용어 사전', '사내 규정', '업무 매뉴얼'],
    values: [3247, 891, 97]
  };
};

export const useWeeklyResponse = (): WeeklyResponse => {
  return {
    values: [
      { day: '월', count: 3500 },
      { day: '화', count: 1412 },
      { day: '수', count: 2986 },
      { day: '목', count: 1812 },
      { day: '금', count: 1294 },
      { day: '토', count: 2286 },
      { day: '일', count: 612 }
    ]
  };
};
