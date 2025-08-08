import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { UploadBaseModal } from '@/components/modal/UploadBaseModal';
import { FileSelectInput } from '@/components/modal/FileSelectInput';
import { FileNameInput } from '@/components/modal/FileNameInput';
import { FileDescriptionInput } from '@/components/modal/FileDescriptionInput';
import { VersionInput } from '@/components/modal/VersionInput';
import { FileCategory } from '@/components/modal/FileCategoryDropdownMenu';
import { UploadInfoCard } from '@/components/modal/UploadInfoCard';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DocumentUploadData) => void;
  isSubmitting?: boolean;
  pageType?: 'policy' | 'report' | 'glossary' | 'document';
}

export interface DocumentUploadData {
  uploadFile?: File;
  fileName: string;
  description: string;
  fileVersion: string;
  category: string; 
}

const CATEGORY = [
  '용어 사전',
  '사내 정책',
  '보고서 양식',
];

const DOCUMENT_UPLOAD_INFO = [
  "지원 형식: 문서(pdf, docx, xlsx, csv)",
  "중복 파일 업로드 시 자동으로 버전 관리됩니다",
  "파일 변경 사항이 자동으로 추적됩니다"
];

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  pageType = 'document'
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

  const [fileError, setFileError] = useState<string>('');

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

  const handleFileError = (error: string) => {
    setFileError(error);
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
    setFileError('');
    setTouched({
      fileName: false,
      description: false,
      fileVersion: false
    });
  };

  const handleClose = () => {
    onClose();
  };

  const getModalTitle = () => {
    switch (pageType) {
      case 'policy':
        return '사내 정책 업로드';
      case 'report':
        return '보고서 양식 업로드';
      case 'glossary':
        return '용어 사전 업로드';
      default:
        return '문서 업로드';
    }
  };

  return (
    <UploadBaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={getModalTitle()}
      onSubmit={handleSubmit}
      submitDisabled={!isFormValid()} 
    >
        <FileSelectInput
         fileDisplayName={fileDisplayName}
         onFileDisplayNameChange={handleFileDisplayNameChange}
         onFileChange={handleFileChange}
         onFileError={handleFileError}
         fileError={fileError}
         accept=".pdf,.docx,.xlsx,.csv"
         maxSizeInMB={10}
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
  margin-bottom: 4px;
`;
