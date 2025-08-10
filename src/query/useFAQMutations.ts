import { useMutation, useQueryClient } from '@tanstack/react-query';
import { faqAPI } from '@/api/faqAPI';

// 공통 쿼리 무효화 함수들
const invalidateFAQQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ['faqList'] });
  queryClient.invalidateQueries({ queryKey: ['faqSearch'] });
  queryClient.invalidateQueries({ queryKey: ['faqFilter'] });
  queryClient.invalidateQueries({ queryKey: ['faqDetail'] });
};

const invalidateAllFAQQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  invalidateFAQQueries(queryClient);
  queryClient.invalidateQueries({ queryKey: ['faqCategories'] });
};

export const useCreateFAQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (faqData: { question: string; answer: string; category: string }) => 
      faqAPI.createFAQ(faqData),
    onSuccess: () => {
      invalidateFAQQueries(queryClient);
    },
  });
};

export const useUpdateFAQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ faqId, faqData }: { faqId: number; faqData: { question: string; answer: string; category: string } }) => 
      faqAPI.updateFAQ(faqId, faqData),
    onSuccess: () => {
      invalidateFAQQueries(queryClient);
    },
  });
};

export const useArchiveFAQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (faqId: number) => faqAPI.archiveFAQ(faqId),
    onSuccess: () => {
      invalidateFAQQueries(queryClient);
    },
  });
};

export const useArchiveFAQCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (categoryName: string) => faqAPI.archiveFAQCategory(categoryName),
    onSuccess: () => {
      invalidateAllFAQQueries(queryClient);
    },
  });
};

export const useRestoreFAQCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (categoryName: string) => faqAPI.restoreFAQCategory(categoryName),
    onSuccess: () => {
      invalidateAllFAQQueries(queryClient);
    },
  });
};
