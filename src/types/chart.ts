export interface DailyConversationData {
  count: number; 
  increase: number; 
}

export interface SuccessRateData {
  percent: number;
  increase: number; 
}  

export interface SatisfactionData {
  percent: number;
  increase: number; 
}

export interface ResponseTimeData {
  avg: number;
  zones: number[]; 
}

export interface TemplateUsageData {
  templates: string[];
  counts: number[];
  percentages: number[];
}

export interface KeywordAnalysisData {
  count: number;
  keywords: string[];
  values: number[];
}

export interface WeeklyResponseData {
  values: number[]; 
}

export interface DonutChartData {
  value: number;
  count: number;
}
