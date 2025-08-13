import { aiApiInstance } from "./apiInstance";
import type {
    DailyConversationData,
    SuccessRateData,
    SatisfactionData,
    ResponseTimeData,
    TemplateUsageData,
    WeeklyResponseData
 } from "@/types/chart";

export class ChartAPI {
  // 일일 대화 수 조회
  static async getDailyConversations() {
    const response = await aiApiInstance.get<DailyConversationData>('/api/chatbot/chat-per-day');
    return response.data;
  }

  // 답변 성공률 조회
  static async getSuccessRate() {
    const response = await aiApiInstance.get<SuccessRateData>('/api/chatbot/success-rate');
    return response.data;
  }

  // 사용자 만족도 조회
  static async getSatisfaction() {
    const response = await aiApiInstance.get<SatisfactionData>('/api/chatbot/satisfy');
    return response.data;
  }

  // 응답 시간 분석 조회
  static async getResponseTime() {
    const response = await aiApiInstance.get<ResponseTimeData>('/api/chatbot/response-time');
    return response.data;
  }

  // 프롬프트 템플릿 사용 통계 조회
  static async getTemplateUsage() {
    const response = await aiApiInstance.get<TemplateUsageData>('/api/chatbot/template-count');
    return response.data;
  }

  // 일주일간 응답 횟수 통계 조회
  static async getWeeklyResponse() {
    const response = await aiApiInstance.get<WeeklyResponseData>('/api/chatbot/week-response');
    return response.data;
  }
}