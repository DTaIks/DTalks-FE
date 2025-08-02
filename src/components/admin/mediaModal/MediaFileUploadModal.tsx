import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { UploadBaseModal } from '../../common/UploadBaseModal';
import { FileSelectInput } from '../../common/FileSelectInput';
import { FileNameInput } from '../../common/FileNameInput';
import { FileDescriptionInput } from '../../common/FileDescriptionInput';
import { VersionInput } from '../../common/VersionInput';
import { PublicSetting } from '../../common/FilePublicSetting';
import { UploadInfoCard } from '../../common/UploadInfoCard';

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MediaUploadData) => void;
  isSubmitting?: boolean;
}

export interface MediaUploadData {
  uploadFile?: File;
  fileName: string;
  description: string;
  fileVersion: string;
  isPublic: boolean;
}

const MEDIA_UPLOAD_INFO = [
  "지원 형식: 이미지(JPG, PNG), 음성(MP3), \n문서(pdf, docx, xlsx)",
  "중복 파일 업로드 시 자동으로 버전 관리됩니다",
  "파일 변경 사항이 자동으로 추적됩니다"
];

const MediaFileUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<MediaUploadData>({
    uploadFile: undefined,
    fileName: '',
    description: '',
    fileVersion: '',
    isPublic: false
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
  
  const hasValidFile = () => formData.uploadFile !== undefined;
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
    >
      <FileSelectInput
        fileDisplayName={fileDisplayName}
        onFileDisplayNameChange={handleFileDisplayNameChange}
        onFileChange={handleFileChange}
        accept="image/*,audio/*,.pdf,.docx,.xlsx"
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
        showError={touched.description && !hasValidDescription()}
      />

      <InputRow>
        <VersionInput
          version={formData.fileVersion}
          onVersionChange={(value) => handleInputChange('fileVersion', value)}
          onBlur={() => handleBlur('fileVersion')}
          showError={touched.fileVersion && !hasValidVersion()}
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
  margin-bottom: 20px;
  > *:first-child {
    flex: 4.5;
  }
  > *:last-child {
    flex: 1.5;
  }
`;
