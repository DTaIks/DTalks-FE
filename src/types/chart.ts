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
