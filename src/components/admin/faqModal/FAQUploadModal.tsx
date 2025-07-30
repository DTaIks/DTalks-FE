import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { UploadBaseModal } from '../../common/UploadBaseModal';
import { FileNameInput } from '../../common/FileNameInput';
import { FileDescriptionInput } from '../../common/FileDescriptionInput';
import { FileCategory } from '../../common/FileCategoryDropdownMenu';
import { UploadInfoCard } from '../../common/UploadInfoCard';

interface FAQUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FAQUploadData) => void;
  isSubmitting?: boolean;
}

export interface FAQUploadData {
  question: string;
  answer: string;
  category: string;
}

const FAQUploadModal: React.FC<FAQUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FAQUploadData>({
    question: '',
    answer: '',
    category: '',
  });

  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);

  // 카테고리 종류
  const categories = [
    '사내 규정',
    'IT/시스템',
    '근무/근태',
    '급여/복리후생',
    '복지/휴가',
  ];

  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    // 저장 버튼을 눌렀을 때 유효성 검사 에러 표시 활성화
    setShowValidationErrors(true);
    
    if (isFormValid()) {
      onSubmit(formData);
      handleReset();
    }
  };

  const handleInputChange = (field: keyof FAQUploadData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.question.trim() !== '' &&
      formData.answer.trim() !== '' &&
      formData.category.trim() !== ''
    );
  };

  const handleReset = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
    });
    setShowValidationErrors(false); 
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <UploadBaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="FAQ 추가"
      onSubmit={handleSubmit}
      submitDisabled={false} 
    >
      <FileNameInput
        value={formData.question}
        onChange={(value) => handleInputChange('question', value)}
        label="질문"
        placeholder="자주 묻는 질문을 입력하세요"
      />

      <FileDescriptionInput
        value={formData.answer}
        onChange={(value) => handleInputChange('answer', value)}
        label="답변"
        placeholder="질문에 대한 답변을 입력하세요"
        showError={showValidationErrors}
      />

      <InputRow>
        <FileCategory
          value={formData.category}
          onChange={(value) => handleInputChange('category', value)}
          options={categories}
          label="카테고리"
        />
      </InputRow>

      <UploadInfoCard
        title="FAQ 추가"
        text1="질문은 사용자 관점에서 명확하게 작성하세요"
        text2="답변은 단계별로 구체적으로 설명하세요"
        text3="답변 관련 링크를 포함하면 더욱 도움이 됩니다"
      />
    </UploadBaseModal>
  );
};

export default FAQUploadModal;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
`;
