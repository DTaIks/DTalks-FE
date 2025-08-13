import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { UploadBaseModal } from '@/components/modal/UploadBaseModal';
import { FileNameInput } from '@/components/modal/FileNameInput';
import { FileDescriptionInput } from '@/components/modal/FileDescriptionInput';
import { FileCategory } from '@/components/modal/FAQCategoryDropdownMenu';
import { UploadInfoCard } from '@/components/modal/UploadInfoCard';

interface FAQUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FAQUploadData) => void;
  isSubmitting?: boolean;
  initialData?: FAQUploadData;
  isEdit?: boolean;
  errorMessage?: string;
}

export interface FAQUploadData {
  question: string;
  answer: string;
  category: string;
}

const CATEGORY = [
  'IT / 시스템',
  '사내 규정',
  '근무 / 근태',
  '급여 / 복리후생',
  '복지 / 휴가',
];

const FAQ_UPLOAD_INFO = [
  "질문은 사용자 관점에서 명확하게 작성하세요",
  "답변은 단계별로 구체적으로 설명하세요",
  "답변 관련 링크를 포함하면 더욱 도움이 됩니다"
];

const FAQUploadModal: React.FC<FAQUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
  isEdit = false,
  errorMessage,
}) => {
  const [formData, setFormData] = useState<FAQUploadData>({
    question: '',
    answer: '',
    category: '', 
  });

  const [touched, setTouched] = useState({
    question: false,
    answer: false
  });

  useEffect(() => {
    if (isOpen && initialData && isEdit) {
      setFormData(initialData);
    } else if (!isOpen) {
      setFormData({
        question: '',
        answer: '',
        category: '',
      });
      setTouched({
        question: false,
        answer: false
      });
    }
  }, [isOpen, initialData, isEdit]);

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit(formData);
      // handleReset()은 제거 - 모달이 성공적으로 닫힐 때 useEffect에서 처리됨
    } else {
      // noop
    }
  };

  const handleInputChange = (field: keyof FAQUploadData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field !== 'category') {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const hasValidQuestion = () => formData.question.trim() !== '';
  const hasValidAnswer = () => formData.answer.trim() !== '';
  const hasValidCategory = () => formData.category.trim() !== '';

  const isFormValid = () => (
    hasValidQuestion() &&
    hasValidAnswer() &&
    hasValidCategory()
  );

  // 내부 초기화 로직은 모달 open/close 효과에서 처리

  const handleClose = () => {
    onClose();
  };

  return (
    <UploadBaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "FAQ 수정" : "FAQ 추가"}
      onSubmit={handleSubmit}
      submitDisabled={!isFormValid() || !!isSubmitting}
    >
      <FileNameInput
        value={formData.question}
        onChange={(value) => handleInputChange('question', value)}
        onBlur={() => handleBlur('question')}
        label="질문"
        placeholder="자주 묻는 질문을 입력하세요"
        showError={touched.question && !hasValidQuestion()}
        errorMessage="질문을 작성하세요"
      />

      <FileDescriptionInput
        value={formData.answer}
        onChange={(value) => handleInputChange('answer', value)}
        onBlur={() => handleBlur('answer')}
        label="답변"
        placeholder="질문에 대한 답변을 입력하세요"
        showError={touched.answer && !hasValidAnswer()}
      />

      <InputRow>
        <FileCategory
          value={formData.category}
          onChange={(value) => handleInputChange('category', value)}
          options={CATEGORY}
          label="카테고리"
        />
      </InputRow>

      {errorMessage && (
        <ErrorMessage>
          {errorMessage}
        </ErrorMessage>
      )}

      <UploadInfoCard
        title={isEdit ? "FAQ 수정" : "FAQ 추가"}
        texts={FAQ_UPLOAD_INFO}
      />
    </UploadBaseModal>
  );
};

export default FAQUploadModal;

const InputRow = styled.div`
  display: flex;
  gap: var(--gap-16);
  margin-bottom: 40px;
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-500);
  margin-bottom: 20px;
  margin-top: -24px;
  padding: 12px 16px;
  padding-left: 25px;
  background-color: rgba(255, 59, 48, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 59, 48, 0.2);
`;
