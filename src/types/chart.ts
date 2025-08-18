// 차트 관련 컴포넌트 Props 타입들
// API 응답 데이터 타입들
export interface DailyConversationData {
  date: string;
  conversationCount: number;
  count: number;
  increase: number;
}

export interface DonutChartData {
  name?: string;
  value: number;
  count: number;
  color?: string;
}

export interface SuccessRateData {
  date: string;
  successRate: number;
  percent: number;
  increase: number;
}

export interface SatisfactionData {
  date: string;
  satisfactionScore: number;
  percent: number;
  increase: number;
}

export interface ResponseTimeData {
  date: string;
  averageResponseTime: number;
  avg: number;
  zones: number[];
}

export interface TemplateUsageData {
  templates: string[];
  counts: number[];
  percentages: number[];
}

export interface WeeklyResponseData {
  week: string;
  responseCount: number;
  values: number[];
}

// DonutChart 컴포넌트
export interface DonutChartProps {
  type: 'smallTalk' | 'qna' | 'formatSearch' | 'organization';
  size?: string;
  value?: number;
  count?: number;
  pathColor?: string;
  trailColor?: string;
}

// StatCard 컴포넌트
export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
}

// ResponseTimeChart 컴포넌트
export interface ResponseTimeChartProps {
  data: Array<{
    date: string;
    responseTime: number;
  }>;
  width?: number;
  height?: number;
  title?: string;
}

// WeeklyResponseStatCard 컴포넌트
export interface WeeklyResponseStatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
}

// PromptTemplate 타입
export interface PromptTemplate {
  smallTalk: DonutChartData;
  qna: DonutChartData;
  formatSearch: DonutChartData;
  organization: DonutChartData;
}

// PromptTemplateCard 컴포넌트
export interface PromptTemplateCardProps {
  title: string;
  description: string;
  usageCount: number;
  lastUsed?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

// ChartDataState 관련 Props
export interface LoadingStateProps {
  message?: string;
}

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export interface NoDataStateProps {
  message: string;
  icon?: React.ReactNode;
}
