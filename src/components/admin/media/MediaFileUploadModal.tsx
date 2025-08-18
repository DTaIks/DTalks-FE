import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { UploadBaseModal } from '@/components/modal/UploadBaseModal';
import { FileSelectInput } from '@/components/modal/FileSelectInput';
import { FileNameInput } from '@/components/modal/FileNameInput';
import { FileDescriptionInput } from '@/components/modal/FileDescriptionInput';
import { VersionInput } from '@/components/modal/VersionInput';
import { PublicSetting } from '@/components/modal/FilePublicSetting';
import { UploadInfoCard } from '@/components/modal/UploadInfoCard';
import type { MediaUploadModalProps, MediaUploadData } from '@/types/media';

const MEDIA_UPLOAD_INFO = [
  "지원 형식: 이미지(JPG, PNG), 음성(MP3), \n문서(pdf, docx, xlsx, csv)",
  "중복 파일 업로드 시 자동으로 버전 관리됩니다",
  "파일 변경 사항이 자동으로 추적됩니다"
];

const MediaFileUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<MediaUploadData>({
    uploadFile: undefined,
    fileName: '',
    description: '',
    fileVersion: '',
    isPublic: false
  });

  const [fileDisplayName, setFileDisplayName] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');

  const [touched, setTouched] = useState({
    fileName: false,
    description: false,
    fileVersion: false
  });

  // 초기 데이터 설정
  useEffect(() => {
    if (isOpen && initialData && isEditMode) {
      setFormData({
        uploadFile: undefined,
        fileName: initialData.fileName || '',
        description: '', // 수정 모드에서는 설명을 빈 값으로 설정
        fileVersion: initialData.fileVersion || '1.0.0',
        isPublic: initialData.isPublic ?? true
      });
      setFileDisplayName('');
    } else if (isOpen && !isEditMode) {
      // 새 파일 업로드 모드일 때 초기화
      setFormData({
        uploadFile: undefined,
        fileName: '',
        description: '',
        fileVersion: '',
        isPublic: false
      });
      setFileDisplayName('');
    }
  }, [isOpen, initialData, isEditMode]);

  useEffect(() => {
    if (!isOpen) {
      setTouched({
        fileName: false,
        description: false,
        fileVersion: false
      });
      setFileError('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit(formData);
      handleReset(); 
    }
  };

  const handleInputChange = (
    field: keyof MediaUploadData,
    value: string | boolean | File | undefined
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field !== 'isPublic') {
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
    setTouched(prev => ({ ...prev, uploadFile: true }));
  };

  const handleFileDisplayNameChange = (fileName: string) => {
    setFileDisplayName(fileName);
  };

  const isValidSemver = (version: string): boolean => /^\d+\.\d+\.\d+$/.test(version);
  
  const hasValidFile = () => {
    // 모든 모드에서 파일이 필수
    return formData.uploadFile !== undefined && !fileError;
  };
  const hasValidFileName = () => formData.fileName.trim() !== '';
  const hasValidDescription = () => formData.description.trim() !== '';
  const hasValidVersion = () => isValidSemver(formData.fileVersion);

  const isFormValid = () => (
    hasValidFile() &&
    hasValidFileName() &&
    hasValidDescription() &&
    hasValidVersion()
  );

  const handleReset = () => {
    setFormData({
      uploadFile: undefined,
      fileName: '',
      description: '',
      fileVersion: '',
      isPublic: false
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

  return (
    <UploadBaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="파일 업로드"
      onSubmit={handleSubmit}
      submitDisabled={!isFormValid()}
      isSubmitting={isSubmitting}
    >
      <FileSelectInput
        fileDisplayName={fileDisplayName}
        onFileDisplayNameChange={handleFileDisplayNameChange}
        onFileChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.mp3,.pdf,.docx,.xlsx,.csv"
        maxSizeInMB={10}
        onFileError={setFileError}
        fileError={fileError}
        placeholder="선택된 파일 없음"
        disabled={false} // 수정 모드에서도 파일 변경 가능
      />

        <FileNameInput
         value={formData.fileName}
         onChange={(value) => handleInputChange('fileName', value)}
         onBlur={() => handleBlur('fileName')}
         showError={touched.fileName && !hasValidFileName()}
       />

      <FileDescriptionInput
        value={formData.description}
        onChange={(value) => handleInputChange('description', value)}
        onBlur={() => handleBlur('description')}
        placeholder={isEditMode ? "수정사항을 작성하시오" : "파일 설명을 입력하세요"}
        showError={touched.description && !hasValidDescription()}
      />

      <InputRow>
                 <VersionInput
           version={formData.fileVersion}
           onVersionChange={(value) => handleInputChange('fileVersion', value)}
           onBlur={() => handleBlur('fileVersion')}
           showError={touched.fileVersion && !hasValidVersion()}
           isEditMode={isEditMode}
         />
        <PublicSetting
          isPublic={formData.isPublic}
          onPublicChange={(value) => handleInputChange('isPublic', value)}
        />
      </InputRow>

      <UploadInfoCard
        title="업로드 정보"
        texts={MEDIA_UPLOAD_INFO}
      />
    </UploadBaseModal>
  );
};

export default MediaFileUploadModal;

const InputRow = styled.div`
  display: flex;
  gap: var(--gap-12);
  margin-bottom: 4px;
  > *:first-child {
    flex: 3.5;
    min-width: 0;
  }
  > *:last-child {
    flex-shrink: 0;
    width: 120px;
  }
`;
