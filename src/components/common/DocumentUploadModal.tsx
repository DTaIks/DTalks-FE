import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { UploadBaseModal } from '@/components/modal/UploadBaseModal';
import { FileSelectInput } from '@/components/modal/FileSelectInput';
import { FileNameInput } from '@/components/modal/FileNameInput';
import { FileDescriptionInput } from '@/components/modal/FileDescriptionInput';
import { VersionInput } from '@/components/modal/VersionInput';
import { FileCategory } from '@/components/modal/FileCategoryDropdownMenu';
import { UploadInfoCard } from '@/components/modal/UploadInfoCard';
import type { DocumentUploadModalProps, DocumentUploadData } from '@/types/modal';

// Props에 에러 관련 속성 추가를 위한 확장 타입
interface ExtendedDocumentUploadModalProps extends DocumentUploadModalProps {
  submitError?: string;
  onClearError?: () => void;
}

const CATEGORY = [
  '용어 사전',
  '사내 정책',
  '보고서 양식',
];

// 카테고리 매핑 (한글 -> 영문)
const CATEGORY_MAPPING: Record<string, string> = {
  '용어 사전': 'glossary',
  '사내 정책': 'policy',
  '보고서 양식': 'reportform'
};

// 영문 -> 한글 매핑 (초기값 설정용)
const REVERSE_CATEGORY_MAPPING: Record<string, string> = {
  'glossary': '용어 사전',
  'policy': '사내 정책',
  'reportform': '보고서 양식'
};

const DOCUMENT_UPLOAD_INFO = [
  "지원 형식: 문서(pdf, docx, xlsx, csv)",
  "중복 파일 업로드 시 자동으로 버전 관리됩니다",
  "파일 변경 사항이 자동으로 추적됩니다"
];

const DocumentUploadModal: React.FC<ExtendedDocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  pageType = 'document',
  mode = 'upload',
  initialData,
  submitError = '',
  onClearError
}) => {
  const [formData, setFormData] = useState<DocumentUploadData>({
    fileId: undefined,
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

  // 초기 데이터가 있으면 폼에 설정 (수정 모드)
  useEffect(() => {
    if (initialData && mode === 'update') {
      setFormData({
        fileId: initialData.fileId,
        uploadFile: undefined,
        fileName: initialData.fileName,
        description: initialData.description || '', // 기존 설명이 있으면 사용, 없으면 빈 값
        fileVersion: initialData.fileVersion,
        category: REVERSE_CATEGORY_MAPPING[initialData.category] || initialData.category,
      });
    }
  }, [initialData, mode]);

  useEffect(() => {
    if (!isOpen) {
      setTouched({
        fileName: false,
        description: false,
        fileVersion: false
      });
      // 에러 초기화는 부모 컴포넌트에서 처리
      onClearError?.();
    }
  }, [isOpen, onClearError]);

  const handleSubmit = () => {
    if (isFormValid()) {
      // 카테고리를 영문으로 변환
      const convertedData = {
        ...formData,
        category: CATEGORY_MAPPING[formData.category] || formData.category
      };

      onSubmit(convertedData);
      handleReset();
    }
  };

  const handleInputChange = (
    field: keyof DocumentUploadData,
    value: string | boolean | File | undefined
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 버전 입력 시 에러 메시지 초기화
    if (field === 'fileVersion' && onClearError) {
      onClearError();
    }
    
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
  
  const hasValidFile = () => formData.uploadFile !== undefined; // 모든 모드에서 파일 필수
  const hasValidFileName = () => formData.fileName.trim() !== '';
  const hasValidDescription = () => formData.description.trim() !== '';
  const hasValidVersion = () => isValidSemver(formData.fileVersion);
  const hasValidCategory = () => formData.category.trim() !== '';

  // 모든 모드에서 모든 필드가 필수 (파일 포함)
  const isFormValid = () => (
    hasValidFile() &&
    hasValidFileName() &&
    hasValidDescription() &&
    hasValidVersion() &&
    hasValidCategory()
  );

  const handleReset = () => {
    setFormData({
      fileId: undefined,
      uploadFile: undefined,
      fileName: '',
      description: '',
      fileVersion: '',
      category: '',
    });
    setFileDisplayName('');
    setFileError('');
    // submitError는 부모 컴포넌트에서 관리
    setTouched({
      fileName: false,
      description: false,
      fileVersion: false
    });
  };

  const handleClose = () => {
    onClearError?.(); // 모달 닫을 때 에러 메시지 초기화
    onClose();
  };

  const getModalTitle = () => {
    const action = mode === 'update' ? '수정' : '업로드';
    switch (pageType) {
      case 'policy':
        return `사내 정책 ${action}`;
      case 'reportform':
        return `보고서 양식 ${action}`;
      case 'glossary':
        return `용어 사전 ${action}`;
      default:
        return `문서 ${action}`;
    }
  };

  return (
    <UploadBaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={getModalTitle()}
      onSubmit={handleSubmit}
      submitDisabled={!isFormValid()}
      isSubmitting={isSubmitting}
      submitText={mode === 'update' ? '수정' : '업로드'}
    >
        <FileSelectInput
         fileDisplayName={fileDisplayName}
         onFileDisplayNameChange={handleFileDisplayNameChange}
         onFileChange={handleFileChange}
         onFileError={handleFileError}
         fileError={fileError}
         accept=".pdf,.docx,.xlsx,.csv"
         maxSizeInMB={10}
         optional={false} // 모든 모드에서 필수
         placeholder="파일을 선택하세요"
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
        placeholder={mode === 'update' ? "수정사항을 작성하시오" : "파일 설명을 입력하세요"}
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

      {submitError && (
        <ErrorMessage>
          {submitError}
        </ErrorMessage>
      )}
    </UploadBaseModal>
  );
};

export default DocumentUploadModal;

const InputRow = styled.div`
  display: flex;
  gap: var(--gap-12);
  margin-bottom: 4px;
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: 12px;
  font-weight: 500;
  margin-top: 8px;
`;
