import { useQuery } from '@tanstack/react-query';
import { ChartAPI } from '@/api/chartAPI';
import type { StatCard } from '@/components/admin/chart/StatCard';
import type { ResponseTime } from '@/components/admin/chart/ResponseTimeCard';
import type { PromptTemplate } from '@/components/admin/chart/PromptTemplateCard';
import type { WeeklyResponse } from '@/components/admin/chart/WeeklyResponseCard';

// 일일 대화 수 조회
export const useDailyChat = () => {
  return useQuery<StatCard>({
    queryKey: ['dailyConversations'],
    queryFn: async () => {
      const data = await ChartAPI.getDailyConversations();
      return {
        title: '일일 대화 수',
        value: data.count,
        increase: data.increase,
        unit: '개',
        compareWith: '어제 대비'
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
  });
};

// 답변 성공률 조회
export const useSuccessRate = () => {
  return useQuery<StatCard>({
    queryKey: ['successRate'],
    queryFn: async () => {
      const data = await ChartAPI.getSuccessRate();
      return {
        title: '답변 성공률',
        value: data.percent,
        increase: data.increase,
        unit: '%',
        compareWith: '지난주 대비'
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
  });
};

// 사용자 만족도 조회
export const useSatisfaction = () => {
  return useQuery<StatCard>({
    queryKey: ['satisfaction'],
    queryFn: async () => {
      const data = await ChartAPI.getSatisfaction();
      return {
        title: '사용자 만족도 (좋아요)',
        value: data.percent,
        increase: data.increase,
        unit: '%',
        compareWith: '지난주 대비'
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
  });
};

// 응답 시간 분석 조회
export const useResponseTime = () => {
  return useQuery<ResponseTime>({
    queryKey: ['responseTime'],
    queryFn: async () => {
      const data = await ChartAPI.getResponseTime();
      return {
        avg: data.avg,
        zones: data.zones
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
  });
};

// 프롬프트 템플릿 사용 통계 조회
export const usePromptTemplate = () => {
  return useQuery<PromptTemplate>({
    queryKey: ['templateUsage'],
    queryFn: async () => {
      const data = await ChartAPI.getTemplateUsage();
      
      const templateIndexMap = {
        smallTalk: data.templates.findIndex(template => template === '일상 대화'),
        organization: data.templates.findIndex(template => template === '조직도 조회'),
        formatSearch: data.templates.findIndex(template => template === '양식 요청'),
        qna: data.templates.findIndex(template => template === 'QnA')
      };
      
      const smallTalkCount = templateIndexMap.smallTalk !== -1 ? data.counts[templateIndexMap.smallTalk] : 0;
      const smallTalkPercent = templateIndexMap.smallTalk !== -1 ? data.percentages[templateIndexMap.smallTalk] : 0;
      
      const organizationCount = templateIndexMap.organization !== -1 ? data.counts[templateIndexMap.organization] : 0;
      const organizationPercent = templateIndexMap.organization !== -1 ? data.percentages[templateIndexMap.organization] : 0;
      
      const formatSearchCount = templateIndexMap.formatSearch !== -1 ? data.counts[templateIndexMap.formatSearch] : 0;
      const formatSearchPercent = templateIndexMap.formatSearch !== -1 ? data.percentages[templateIndexMap.formatSearch] : 0;

      const qnaCount = templateIndexMap.qna !== -1 ? data.counts[templateIndexMap.qna] : 0;
      const qnaPercent = templateIndexMap.qna !== -1 ? data.percentages[templateIndexMap.qna] : 0;
      
      return {
        smallTalk: { 
          value: Math.round(smallTalkPercent), 
          count: smallTalkCount 
        },
        qna: { 
          value: Math.round(qnaPercent), 
          count: qnaCount 
        },
        formatSearch: { 
          value: Math.round(formatSearchPercent), 
          count: formatSearchCount 
        },
        organization: { 
          value: Math.round(organizationPercent), 
          count: organizationCount 
        }
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
  });
};

// 일주일간 응답 횟수 통계 조회
export const useWeeklyResponse = () => {
  return useQuery<WeeklyResponse>({
    queryKey: ['weeklyResponse'],
    queryFn: async () => {
      const data = await ChartAPI.getWeeklyResponse();
      const days = ['월', '화', '수', '목', '금', '토', '일'];
      
      return {
        values: data.values.map((count, index) => ({
          day: days[index],
          count
        }))
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
  });
};
