import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { UploadBaseModal } from '../../common/UploadBaseModal';
import { FileSelectInput } from '../../common/FileSelectInput';
import { FileNameInput } from '../../common/FileNameInput';
import { FileDescriptionInput } from '../../common/FileDescriptionInput';
import { VersionInput } from '../../common/VersionInput';
import { FileCategory } from '../../common/FileCategoryDropdownMenu';
import { UploadInfoCard } from '../../common/UploadInfoCard';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DocumentUploadData) => void;
  isSubmitting?: boolean;
}

export interface DocumentUploadData {
  uploadFile?: File;
  fileName: string;
  description: string;
  fileVersion: string;
  category: string; 
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<DocumentUploadData>({
    uploadFile: undefined,
    fileName: '',
    description: '',
    fileVersion: '',
    category: '',
  });

  const [fileDisplayName, setFileDisplayName] = useState<string>('');
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);

  // 카테고리 종류
  const category = [
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
    setShowValidationErrors(true);
    
    if (isFormValid()) {
      onSubmit(formData);
      handleReset();
    }
  };

  const handleInputChange = (field: keyof DocumentUploadData, value: string | boolean | File | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      uploadFile: file || undefined
    }));
  };

  const handleFileDisplayNameChange = (fileName: string) => {
    setFileDisplayName(fileName);
  };

  const isFormValid = () => {
    const isValidSemver = (version: string): boolean => {
      return /^\d+\.\d+\.\d+$/.test(version);
    };

    return (
      formData.uploadFile !== undefined &&
      formData.fileName.trim() !== '' &&
      formData.description.trim() !== '' &&
      isValidSemver(formData.fileVersion) &&
      formData.category.trim() !== ''
    );
  };

  const handleReset = () => {
    setFormData({
      uploadFile: undefined,
      fileName: '',
      description: '',
      fileVersion: '',
      category: '',
    });
    setFileDisplayName('');
    setShowValidationErrors(false); 
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <UploadBaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="문서 업로드"
      onSubmit={handleSubmit}
      submitDisabled={false} 
    >
      <FileSelectInput
        fileDisplayName={fileDisplayName}
        onFileDisplayNameChange={handleFileDisplayNameChange}
        onFileChange={handleFileChange}
        accept=".pdf,.docx,.xlsx"
      />

      <FileNameInput
        value={formData.fileName}
        onChange={(value) => handleInputChange('fileName', value)}
        placeholder="파일명을 입력하세요"
      />

      <FileDescriptionInput
        value={formData.description}
        onChange={(value) => handleInputChange('description', value)}
        showError={showValidationErrors}
      />

      <InputRow>
        <VersionInput
          version={formData.fileVersion}
          onVersionChange={(value) => handleInputChange('fileVersion', value)}
          showError={showValidationErrors}
        />
        <FileCategory
          value={formData.category}
          onChange={(value) => handleInputChange('category', value)}
          options={category}
          label="카테고리"
        />
      </InputRow>

      <UploadInfoCard
        title="업로드 정보"
        text1={`지원 형식: 문서(pdf, docx, xlsx)`}
        text2="중복 파일 업로드 시 자동으로 버전 관리됩니다"
        text3="파일 변경 사항이 자동으로 추적됩니다"
      />
    </UploadBaseModal>
  );
};

export default DocumentUploadModal;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
`;
