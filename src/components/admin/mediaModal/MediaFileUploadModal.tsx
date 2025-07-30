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
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);

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

  const handleInputChange = (field: keyof MediaUploadData, value: string | boolean | File | undefined) => {
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
      isValidSemver(formData.fileVersion)
    );
  };

  const handleReset = () => {
    setFormData({
      uploadFile: undefined,
      fileName: '',
      description: '',
      fileVersion: '',
      isPublic: false
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
      title="파일 업로드"
      onSubmit={handleSubmit}
      submitDisabled={false} 
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
        <PublicSetting
          isPublic={formData.isPublic}
          onPublicChange={(value) => handleInputChange('isPublic', value)}
        />
      </InputRow>

      <UploadInfoCard
        title="업로드 정보"
        text1={`지원 형식: 이미지(JPG, PNG), 음성(MP3), \n문서(pdf, docx, xlsx)`}
        text2="중복 파일 업로드 시 자동으로 버전 관리됩니다"
        text3="파일 변경 사항이 자동으로 추적됩니다"
      />
    </UploadBaseModal>
  );
};

export default MediaFileUploadModal;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  > *:first-child {
    flex: 4.5;
  }
  
  > *:last-child {
    flex: 1.5;
  }
`;
