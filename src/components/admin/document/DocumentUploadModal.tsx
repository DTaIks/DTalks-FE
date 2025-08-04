import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { UploadBaseModal } from '../../modal/UploadBaseModal';
import { FileSelectInput } from '../../modal/FileSelectInput';
import { FileNameInput } from '../../modal/FileNameInput';
import { FileDescriptionInput } from '../../modal/FileDescriptionInput';
import { VersionInput } from '../../modal/VersionInput';
import { FileCategory } from '../../modal/FileCategoryDropdownMenu';
import { UploadInfoCard } from '../../modal/UploadInfoCard';

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

const CATEGORY = [
  '사내 규정',
  'IT/시스템',
  '근무/근태',
  '급여/복리후생',
  '복지/휴가',
];

const DOCUMENT_UPLOAD_INFO = [
  "지원 형식: 문서(pdf, docx, xlsx)",
  "중복 파일 업로드 시 자동으로 버전 관리됩니다",
  "파일 변경 사항이 자동으로 추적됩니다"
];

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

  const [touched, setTouched] = useState({
    fileName: false,
    description: false,
    fileVersion: false
  });

  useEffect(() => {
    if (!isOpen) {
      setTouched({
        fileName: false,
        description: false,
        fileVersion: false
      });
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit(formData);
      handleReset();
    }
  };

  const handleInputChange = (
    field: keyof DocumentUploadData,
    value: string | boolean | File | undefined
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field !== 'uploadFile' && field !== 'category') {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
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

  const isValidSemver = (version: string): boolean => /^\d+\.\d+\.\d+$/.test(version);
  
  const hasValidFile = () => formData.uploadFile !== undefined;
  const hasValidFileName = () => formData.fileName.trim() !== '';
  const hasValidDescription = () => formData.description.trim() !== '';
  const hasValidVersion = () => isValidSemver(formData.fileVersion);
  const hasValidCategory = () => formData.category.trim() !== '';

  const isFormValid = () => (
    hasValidFile() &&
    hasValidFileName() &&
    hasValidDescription() &&
    hasValidVersion() &&
    hasValidCategory()
  );

  const handleReset = () => {
    setFormData({
      uploadFile: undefined,
      fileName: '',
      description: '',
      fileVersion: '',
      category: '',
    });
    setFileDisplayName('');
    setTouched({
      fileName: false,
      description: false,
      fileVersion: false
    });
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
      submitDisabled={!isFormValid()} 
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
        onBlur={() => handleBlur('fileName')}
        placeholder="파일명을 입력하세요"
        showError={touched.fileName && !hasValidFileName()}
      />

      <FileDescriptionInput
        value={formData.description}
        onChange={(value) => handleInputChange('description', value)}
        onBlur={() => handleBlur('description')}
        showError={touched.description && !hasValidDescription()}
      />

      <InputRow>
        <VersionInput
          version={formData.fileVersion}
          onVersionChange={(value) => handleInputChange('fileVersion', value)}
          onBlur={() => handleBlur('fileVersion')}
          showError={touched.fileVersion && !hasValidVersion()}
        />
        <FileCategory
          value={formData.category}
          onChange={(value) => handleInputChange('category', value)}
          options={CATEGORY}
          label="카테고리"
        />
      </InputRow>

      <UploadInfoCard
        title="업로드 정보"
        texts={DOCUMENT_UPLOAD_INFO}
      />
    </UploadBaseModal>
  );
};

export default DocumentUploadModal;

const InputRow = styled.div`
  display: flex;
  gap: var(--gap-12);
  margin-bottom: 32px;
`;
