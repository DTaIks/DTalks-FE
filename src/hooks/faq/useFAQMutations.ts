import { useMutation, useQueryClient } from '@tanstack/react-query';
import { faqAPI } from '@/api/faqAPI';

export const useCreateFAQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (faqData: { question: string; answer: string; category: string }) => 
      faqAPI.createFAQ(faqData),
    onSuccess: () => {
      // FAQ 목록과 검색 결과, 필터 결과, 상세 정보 쿼리 무효화하여 최신 데이터 반영
      queryClient.invalidateQueries({ queryKey: ['faqList'] });
      queryClient.invalidateQueries({ queryKey: ['faqSearch'] });
      queryClient.invalidateQueries({ queryKey: ['faqFilter'] });
      queryClient.invalidateQueries({ queryKey: ['faqDetail'] });
    },
  });
};

