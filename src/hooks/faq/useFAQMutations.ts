import { useMutation, useQueryClient } from '@tanstack/react-query';
import { faqAPI } from '@/api/faqAPI';

export const useCreateFAQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (faqData: { question: string; answer: string; category: string }) => 
      faqAPI.createFAQ(faqData),
    onSuccess: () => {
      // FAQ 목록과 검색 결과 캐시를 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['faqList'] });
      queryClient.invalidateQueries({ queryKey: ['faqSearch'] });
    },
  });
};

