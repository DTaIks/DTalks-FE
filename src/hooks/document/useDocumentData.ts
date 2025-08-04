import { useState } from "react";
import DocumentCategory1 from "../../assets/document/DocumentCategory1.svg";
import DocumentCategory2 from "../../assets/document/DocumentCategory2.svg";
import DocumentCategory3 from "../../assets/document/DocumentCategory3.svg";
import ActiveIcon from "../../assets/common/Active.svg";
import InActiveIcon from "../../assets/common/InActive.svg";

export interface DocumentItem {
  id: number;
  name: string;
  category: string;
  categoryImage: string;
  version: string;
  author: string;
  lastModified: string;
  status: string;
  statusIcon: string;
}

export const DOCUMENT_DATA: DocumentItem[] = [
  {
    id: 1,
    name: "개발팀 업무 매뉴얼",
    category: "매뉴얼",
    categoryImage: DocumentCategory1,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
  {
    id: 2,
    name: "개발팀 업무 매뉴얼",
    category: "사내 규정",
    categoryImage: DocumentCategory2,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
  {
    id: 3,
    name: "개발팀 업무 매뉴얼",
    category: "양식",
    categoryImage: DocumentCategory3,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
  {
    id: 4,
    name: "개발팀 업무 매뉴얼",
    category: "양식",
    categoryImage: DocumentCategory3,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
  {
    id: 5,
    name: "개발팀 업무 매뉴얼",
    category: "양식",
    categoryImage: DocumentCategory3,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "활성",
    statusIcon: ActiveIcon
  },
  {
    id: 6,
    name: "용어사전",
    category: "용어사전",
    categoryImage: DocumentCategory1,
    version: "v1.0.0",
    author: "정지민",
    lastModified: "2024-08-08 00:00",
    status: "비활성",
    statusIcon: InActiveIcon
  },
];

export const CATEGORY_OPTIONS = [
  { value: "", label: "전체 카테고리" },
  { value: "policy", label: "사내 규정" },
  { value: "manual", label: "매뉴얼" },
  { value: "dictionary", label: "용어사전" }
];

export const STATUS_OPTIONS = [
  { value: "", label: "전체 상태" },
  { value: "active", label: "활성" },
  { value: "inactive", label: "비활성" },
];

export const COLUMN_HEADERS = ['문서명', '카테고리', '버전', '작성자', '최종수정일', '상태', '작업'];

export const useDocumentData = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState<DocumentItem[]>(DOCUMENT_DATA);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const handleArchive = (documentId: number) => {
    setDocuments(prevDocuments => 
      prevDocuments.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: "비활성", statusIcon: InActiveIcon }
          : doc
      )
    );
  };

  const getFilteredData = (currentPage: number, itemsPerPage: number) => {
    let filteredData = documents;

    if (searchTerm) {
      filteredData = filteredData.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredData = filteredData.filter(doc => {
        switch (selectedCategory) {
          case "policy":
            return doc.category === "사내 규정";
          case "manual":
            return doc.category === "매뉴얼";
          case "dictionary":
            return doc.category === "용어사전";
          default:
            return true;
        }
      });
    }

    if (selectedStatus) {
      filteredData = filteredData.filter(doc => {
        switch (selectedStatus) {
          case "active":
            return doc.status === "활성";
          case "inactive":
            return doc.status === "비활성";
          default:
            return true;
        }
      });
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      paginatedData: filteredData.slice(startIndex, endIndex),
      totalItems: filteredData.length
    };
  };

  return {
    searchTerm,
    selectedCategory,
    selectedStatus,
    handleSearch,
    handleCategoryChange,
    handleStatusChange,
    handleArchive,
    getFilteredData,
    categoryOptions: CATEGORY_OPTIONS,
    statusOptions: STATUS_OPTIONS,
    columnHeaders: COLUMN_HEADERS
  };
}; 