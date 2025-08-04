import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { UploadBaseModal } from '../../modal/UploadBaseModal';
import { FileNameInput } from '../../modal/FileNameInput';
import { FileDescriptionInput } from '../../modal/FileDescriptionInput';
import { FileCategory } from '../../modal/FileCategoryDropdownMenu';
import { UploadInfoCard } from '../../modal/UploadInfoCard';

interface FAQUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FAQUploadData) => void;
  isSubmitting?: boolean;
  initialData?: FAQUploadData;
  isEdit?: boolean;
}

export interface FAQUploadData {
  question: string;
  answer: string;
  category: string;
}

const CATEGORY = [
  '사내 규정',
  'IT/시스템',
  '근무/근태',
  '급여/복리후생',
  '복지/휴가',
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
  initialData,
  isEdit = false,
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
      setTouched({
        question: false,
        answer: false
      });
    }
  }, [isOpen, initialData, isEdit]);

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit(formData);
      handleReset();
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

  const handleReset = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
    });
    setTouched({
      question: false,
      answer: false
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <UploadBaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "FAQ 수정" : "FAQ 추가"}
      onSubmit={handleSubmit}
      submitDisabled={!isFormValid()}
    >
      <FileNameInput
        value={formData.question}
        onChange={(value) => handleInputChange('question', value)}
        onBlur={() => handleBlur('question')}
        label="질문"
        placeholder="자주 묻는 질문을 입력하세요"
        showError={touched.question && !hasValidQuestion()}
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
  gap: var(--gap-12);
  margin-bottom: 40px;
`;
