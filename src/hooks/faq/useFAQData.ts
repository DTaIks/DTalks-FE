import { useState, useCallback, useMemo } from "react";
import CategoryName1 from "../../assets/faq/CategoryName1.svg";
import CategoryName2 from "../../assets/faq/CategoryName2.svg";
import CategoryName3 from "../../assets/faq/CategoryName3.svg";
import CategoryName4 from "../../assets/faq/CategoryName4.svg";
import CategoryName5 from "../../assets/faq/CategoryName5.svg";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  categoryImage: string;
  isActive: boolean;
  createdAt: string;
}

interface TableColumn {
  key: string;
  label: string;
}

interface CategoryOption {
  value: string;
  label: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "계정 비밀번호를 변경하는 방법은? 계정 비밀번호를 변경하는 방법은?",
    answer: "회사 메일 포털 → [설정] → [비밀번호 변경] 메뉴에서 직접 변경 가능합니다. 보안을 위해 3개월마다 비밀번호 변경을 권장합니다. [비밀번호 변경] 메뉴에서 직접 변경 가능합니다. 보안을 위해 3개월마다 비밀번호 변경을 권장합니다.",
    category: "IT/시스템",
    categoryImage: CategoryName1,
    isActive: true,
    createdAt: "2024-01-16 14:30",
  },
  {
    id: 2,
    question: "계정 비밀번호를 변경하는 방법은?",
    answer: "회사 메일 포털 → [설정] → [비밀번호 변경] 메뉴에서 직접 변경 가능합니다. 보안을 위해 3개월마다 비밀번호 변경을 권장합니다.",
    category: "사내 규정",
    categoryImage: CategoryName2,
    isActive: true,
    createdAt: "2024-01-16 14:30",
  },
  {
    id: 3,
    question: "계정 비밀번호를 변경하는 방법은?",
    answer: "회사 메일 포털 → [설정] → [비밀번호 변경] 메뉴에서 직접 변경 가능합니다. 보안을 위해 3개월마다 비밀번호 변경을 권장합니다.",
    category: "근무 / 근태",
    categoryImage: CategoryName3,
    isActive: true,
    createdAt: "2024-01-16 14:30",
  },
  {
    id: 4,
    question: "계정 비밀번호를 변경하는 방법은?",
    answer: "회사 메일 포털 → [설정] → [비밀번호 변경] 메뉴에서 직접 변경 가능합니다. 보안을 위해 3개월마다 비밀번호 변경을 권장합니다.",
    category: "급여 / 복리후생",
    categoryImage: CategoryName4,
    isActive: true,
    createdAt: "2024-01-16 14:30",
  },
  {
    id: 5,
    question: "계정 비밀번호를 변경하는 방법은?",
    answer: "회사 메일 포털 → [설정] → [비밀번호 변경] 메뉴에서 직접 변경 가능합니다. 보안을 위해 3개월마다 비밀번호 변경을 권장합니다.",
    category: "복지 / 휴가",
    categoryImage: CategoryName5,
    isActive: false,
    createdAt: "2024-01-16 14:30",
  },
  {
    id: 6,
    question: "회사 복지 혜택은 어떻게 확인하나요?",
    answer: "사내 포털 → [복지] → [복지 혜택] 메뉴에서 모든 복지 혜택을 확인할 수 있습니다. 각 부서별로 다른 혜택이 제공될 수 있으니 참고하세요. ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ",
    category: "복지 / 휴가",
    categoryImage: CategoryName5,
    isActive: true,
    createdAt: "2024-01-17 09:15",
  },
  {
    id: 7,
    question: "연차 신청은 언제까지 해야 하나요?",
    answer: "연차 신청은 사용일 기준 최소 3일 전까지 신청해야 합니다. 긴급한 경우에는 팀장 승인 후 사용 가능합니다.",
    category: "근무 / 근태",
    categoryImage: CategoryName3,
    isActive: true,
    createdAt: "2024-01-17 10:30",
  },
  {
    id: 8,
    question: "급여 지급일은 언제인가요?",
    answer: "급여는 매월 25일에 지급됩니다. 공휴일인 경우 전 영업일에 지급됩니다.",
    category: "급여 / 복리후생",
    categoryImage: CategoryName4,
    isActive: true,
    createdAt: "2024-01-18 11:45",
  }
];

const TABLE_COLUMNS: TableColumn[] = [
  { key: "question", label: "질문" },
  { key: "answer", label: "카테고리" },
  { key: "category", label: "상태" },
  { key: "isActive", label: "최종 수정일" },
  { key: "action", label: "작업" }
];

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: "", label: "전체 카테고리" },
  { value: "it", label: "IT/시스템" },
  { value: "policy", label: "사내 규정" },
  { value: "work", label: "근무 / 근태" },
  { value: "salary", label: "급여 / 복리후생" },
  { value: "welfare", label: "복지 / 휴가" }
];

export const useFAQData = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>(FAQ_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 필터링된 데이터만 반환하는 함수
  const getFilteredDataOnly = useMemo(() => {
    let filteredData = faqItems;

    // 검색 필터링
    if (searchTerm) {
      filteredData = filteredData.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 카테고리 필터링
    if (selectedCategory) {
      filteredData = filteredData.filter(faq => {
        switch (selectedCategory) {
          case "it":
            return faq.category === "IT/시스템";
          case "policy":
            return faq.category === "사내 규정";
          case "work":
            return faq.category === "근무 / 근태";
          case "salary":
            return faq.category === "급여 / 복리후생";
          case "welfare":
            return faq.category === "복지 / 휴가";
          default:
            return true;
        }
      });
    }

    return filteredData;
  }, [faqItems, searchTerm, selectedCategory]);

  const getFilteredData = useCallback((currentPage: number, itemsPerPage: number) => {
    const filteredData = getFilteredDataOnly;
    
    // 전체 필터링된 데이터의 길이
    const totalItems = filteredData.length;

    // 페이지네이션
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      paginatedData: filteredData.slice(startIndex, endIndex),
      totalItems: totalItems
    };
  }, [getFilteredDataOnly]);

  const handleArchive = useCallback((id: number) => {
    setFaqItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, isActive: false } : item
      )
    );
  }, []);

  const handleUpdateFAQ = useCallback((id: number, updatedData: { question: string; answer: string; category: string }) => {
    setFaqItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { 
          ...item, 
          question: updatedData.question,
          answer: updatedData.answer,
          category: updatedData.category
        } : item
      )
    );
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return {
    faqItems,
    setFaqItems,
    selectedCategory,
    searchTerm,
    handleArchive,
    handleUpdateFAQ,
    handleCategoryChange,
    handleSearch,
    getFilteredData,
    getFilteredDataOnly,
    tableColumns: TABLE_COLUMNS,
    categoryOptions: CATEGORY_OPTIONS,
  };
};

export type { FAQItem, TableColumn, CategoryOption }; 