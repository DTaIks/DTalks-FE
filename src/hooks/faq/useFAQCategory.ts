import { useState, useCallback } from 'react';
import type { FAQCategory, ConfirmModalState } from '@/types/faq';
import CategoryName1 from '@/assets/faq/CategoryName1.svg';
import CategoryName2 from '@/assets/faq/CategoryName2.svg';
import CategoryName3 from '@/assets/faq/CategoryName3.svg';
import CategoryName4 from '@/assets/faq/CategoryName4.svg';
import CategoryName5 from '@/assets/faq/CategoryName5.svg';

export const useFAQCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null);
  
  // 목데이터 - 나중에 백엔드 API로 교체
  const CATEGORY_DATA: FAQCategory[] = [
    {
      categoryId: "1",
      categoryName: "IT / 시스템",
      categoryNameImage: CategoryName1,
      description: "재택근무, 출입증, 사내 메신저 사용 등 사내 규정 관련 질문",
      faqCount: 3,
      isActive: true
    },
    {
      categoryId: "2", 
      categoryName: "사내 규정",
      categoryNameImage: CategoryName2,
      description: "재택근무, 출입증, 사내 메신저 사용 등 사내 규정 관련 질문",
      faqCount: 8,
      isActive: true
    },
    {
      categoryId: "3",
      categoryName: "근무 / 근태",
      categoryNameImage: CategoryName3,
      description: "재택근무, 출입증, 사내 메신저 사용 등 사내 규정 관련 질문",
      faqCount: 5,
      isActive: false
    },
    {
      categoryId: "4",
      categoryName: "급여 / 복리후생",
      categoryNameImage: CategoryName4,
      description: "재택근무, 출입증, 사내 메신저 사용 등 사내 규정 관련 질문",
      faqCount: 15,
      isActive: true
    },
    {
      categoryId: "5",
      categoryName: "복지 / 휴가",
      categoryNameImage: CategoryName5,
      description: "재택근무, 출입증, 사내 메신저 사용 등 사내 규정 관련 질문",
      faqCount: 12,
      isActive: true
    }
  ];
  
  const [categoryData, setCategoryData] = useState<FAQCategory[]>(CATEGORY_DATA);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    type: null,
    categoryId: null,
    categoryName: ''
  });

  const handleRowClick = useCallback((category: FAQCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleArchive = useCallback((categoryId: string) => {
    setCategoryData(prevData => 
      prevData.map(category => 
        category.categoryId === categoryId 
          ? { ...category, isActive: !category.isActive }
          : category
      )
    );
  }, []);

  const handleArchiveClick = useCallback((category: FAQCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      type: category.isActive ? 'archive' : 'restore',
      categoryId: category.categoryId,
      categoryName: category.categoryName
    });
  }, []);

  const handleConfirmAction = useCallback(() => {
    if ((confirmModal.type === 'archive' || confirmModal.type === 'restore') && confirmModal.categoryId) {
      handleArchive(confirmModal.categoryId);
    }
    setConfirmModal({
      isOpen: false,
      type: null,
      categoryId: null,
      categoryName: ''
    });
  }, [confirmModal, handleArchive]);

  const handleCloseConfirmModal = useCallback(() => {
    setConfirmModal({
      isOpen: false,
      type: null,
      categoryId: null,
      categoryName: ''
    });
  }, []);

  return {
    selectedCategory,
    categoryData,
    confirmModal,
    handleRowClick,
    handleArchiveClick,
    handleConfirmAction,
    handleCloseConfirmModal
  };
}; 