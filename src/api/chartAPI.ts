import { aiApiInstance } from "./apiInstance";

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

export class ChartAPI {
  // 일일 대화 수 조회
  static async getDailyConversations() {
    try {
      const response = await aiApiInstance.get<DailyConversationData>('/api/chatbot/chat-per-day');
      return response.data;
    } catch (error) {
      console.error('일일 대화 수 조회 실패:', error);
      throw error;
    }
  }

  // 답변 성공률 조회
  static async getSuccessRate() {
    try {
      const response = await aiApiInstance.get<SuccessRateData>('/api/chatbot/success-rate');
      return response.data;
    } catch (error) {
      console.error('답변 성공률 조회 실패:', error);
      throw error;
    }
  }

  // 사용자 만족도 조회
  static async getSatisfaction() {
    try {
      const response = await aiApiInstance.get<SatisfactionData>('/api/chatbot/satisfy');
      return response.data;
    } catch (error) {
      console.error('사용자 만족도 조회 실패:', error);
      throw error;
    }
  }

  // 응답 시간 분석 조회
  static async getResponseTime() {
    try {
      const response = await aiApiInstance.get<ResponseTimeData>('/api/chatbot/response-time');
      return response.data;
    } catch (error) {
      console.error('응답 시간 분석 조회 실패:', error);
      throw error;
    }
  }

  // 프롬프트 템플릿 사용 통계 조회
  static async getTemplateUsage() {
    try {
      const response = await aiApiInstance.get<TemplateUsageData>('/api/chatbot/template-count');
      return response.data;
    } catch (error) {
      console.error('프롬프트 템플릿 사용 통계 조회 실패:', error);
      throw error;
    }
  }

  // 질문 키워드 분석 조회
  static async getKeywordAnalysis() {
    try {
      const response = await aiApiInstance.get<KeywordAnalysisData>('/api/chatbot/keyword');
      return response.data;
    } catch (error) {
      console.error('질문 키워드 분석 조회 실패:', error);
      throw error;
    }
  }

  // 일주일간 응답 횟수 통계 조회
  static async getWeeklyResponse() {
    try {
      const response = await aiApiInstance.get<WeeklyResponseData>('/api/chatbot/week-response');
      return response.data;
    } catch (error) {
      console.error('일주일간 응답 횟수 통계 조회 실패:', error);
      throw error;
    }
  }
}
