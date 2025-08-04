import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import CategoryName1 from "../assets/faq/CategoryName1.svg";
import CategoryName2 from "../assets/faq/CategoryName2.svg";
import CategoryName3 from "../assets/faq/CategoryName3.svg";
import CategoryName4 from "../assets/faq/CategoryName4.svg";
import CategoryName5 from "../assets/faq/CategoryName5.svg";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  categoryImage: string;
  isActive: boolean;
  createdAt: string;
}

interface FAQState {
  faqItems: FAQItem[];
  selectedCategory: string;
  searchTerm: string;
  filteredData: FAQItem[];
  
  setSelectedCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  updateFAQItem: (id: number, updatedData: Partial<FAQItem>) => void;
  archiveFAQItem: (id: number) => void;
  updateFilteredData: () => void;
  
  getFilteredData: (currentPage: number, itemsPerPage: number) => {
    paginatedData: FAQItem[];
    totalItems: number;
  };
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "계정 비밀번호를 변경하는 방법은?",
    answer: "회사 메일 포털 → [설정] → [비밀번호 변경] 메뉴에서 직접 변경 가능합니다. 보안을 위해 3개월마다 비밀번호 변경을 권장합니다.",
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
    answer: "사내 포털 → [복지] → [복지 혜택] 메뉴에서 모든 복지 혜택을 확인할 수 있습니다. 각 부서별로 다른 혜택이 제공될 수 있으니 참고하세요.",
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

// FAQ 스토어
export const useFAQStore = create<FAQState>()(
  devtools(
    (set, get) => ({
      faqItems: FAQ_DATA,
      selectedCategory: "",
      searchTerm: "",
      filteredData: FAQ_DATA,

      setSelectedCategory: (category: string) => {
        set({ selectedCategory: category });
        get().updateFilteredData();
      },

      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
        get().updateFilteredData();
      },

      updateFilteredData: () => {
        const { faqItems, selectedCategory, searchTerm } = get();
        let filteredData = faqItems;

        if (searchTerm) {
          filteredData = filteredData.filter(faq => 
            faq.question.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

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

        set({ filteredData });
      },

      updateFAQItem: (id: number, updatedData: Partial<FAQItem>) => {
        set(state => ({
          faqItems: state.faqItems.map(item => 
            item.id === id ? { ...item, ...updatedData } : item
          )
        }));
        get().updateFilteredData();
      },

      archiveFAQItem: (id: number) => {
        set(state => ({
          faqItems: state.faqItems.map(item => 
            item.id === id ? { ...item, isActive: false } : item
          )
        }));
        get().updateFilteredData();
      },

      getFilteredData: (currentPage: number, itemsPerPage: number) => {
        const { filteredData } = get();
        const totalItems = filteredData.length;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        return {
          paginatedData: filteredData.slice(startIndex, endIndex),
          totalItems
        };
      }
    }),
    {
      name: 'faq-store'
    }
  )
);

export type { FAQItem }; 