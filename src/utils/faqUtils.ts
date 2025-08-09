import type { FAQApiItem, FAQItem, FAQCategoryApiItem, FAQCategory } from '@/types/faq';
import CategoryName1 from "@/assets/faq/CategoryName1.svg";
import CategoryName2 from "@/assets/faq/CategoryName2.svg";
import CategoryName3 from "@/assets/faq/CategoryName3.svg";
import CategoryName4 from "@/assets/faq/CategoryName4.svg";
import CategoryName5 from "@/assets/faq/CategoryName5.svg";

// 카테고리별 이미지 매핑
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'IT / 시스템': CategoryName1,
  '사내 규정': CategoryName2,
  '근무 / 근태': CategoryName3,
  '급여 / 복리후생': CategoryName4,
  '복지 / 휴가': CategoryName5,
};

// 기본 이미지 (매핑되지 않은 카테고리용)
const DEFAULT_CATEGORY_IMAGE = CategoryName1;

/**
 * API 응답의 FAQ 아이템을 클라이언트용 FAQ 아이템으로 변환
 */
export function transformFAQApiItem(apiItem: FAQApiItem): FAQItem {
  return {
    faqId: apiItem.faqId,
    question: apiItem.question,
    category: apiItem.category,
    categoryImage: CATEGORY_IMAGE_MAP[apiItem.category] || DEFAULT_CATEGORY_IMAGE,
    isActive: apiItem.isActive,
    updatedAt: apiItem.updatedAt,
    createdAt: apiItem.updatedAt, // updatedAt을 createdAt으로도 사용
    answer: undefined, // 목록에서는 answer가 없음
  };
}

/**
 * API 응답의 FAQ 아이템 배열을 클라이언트용으로 변환
 */
export function transformFAQApiItems(apiItems: FAQApiItem[]): FAQItem[] {
  return apiItems.map(transformFAQApiItem);
}

/**
 * 카테고리 이름으로 이미지 가져오기
 */
export function getCategoryImage(category: string): string {
  return CATEGORY_IMAGE_MAP[category] || DEFAULT_CATEGORY_IMAGE;
}

/**
 * 카테고리 필터 값을 실제 카테고리 이름으로 변환
 */
export function getCategoryNameFromFilter(filterValue: string): string {
  const categoryMap: Record<string, string> = {
    'it': 'IT / 시스템',
    'policy': '사내 규정',
    'work': '근무 / 근태',
    'salary': '급여 / 복리후생',
    'welfare': '복지 / 휴가',
  };
  
  return categoryMap[filterValue] || '';
}

/**
 * 실제 카테고리 이름을 필터 값으로 변환
 */
export function getFilterValueFromCategory(categoryName: string): string {
  const filterMap: Record<string, string> = {
    'IT / 시스템': 'it',
    '사내 규정': 'policy',
    '근무 / 근태': 'work',
    '급여 / 복리후생': 'salary',
    '복지 / 휴가': 'welfare',
  };
  
  return filterMap[categoryName] || '';
}

/**
 * API 응답의 FAQ 카테고리를 클라이언트용으로 변환
 */
export function transformFAQCategoryApiItem(apiItem: FAQCategoryApiItem): FAQCategory {
  return {
    categoryId: apiItem.categoryId.toString(),
    categoryName: apiItem.categoryName,
    categoryNameImage: CATEGORY_IMAGE_MAP[apiItem.categoryName] || DEFAULT_CATEGORY_IMAGE,
    description: apiItem.description,
    faqCount: apiItem.faqCount,
    isActive: apiItem.isActive,
  };
}

/**
 * API 응답의 FAQ 카테고리 배열을 클라이언트용으로 변환
 */
export function transformFAQCategoryApiItems(apiItems: FAQCategoryApiItem[]): FAQCategory[] {
  return apiItems.map(transformFAQCategoryApiItem);
}
