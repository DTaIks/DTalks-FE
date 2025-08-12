import React, { useRef } from 'react';
import styled from 'styled-components';

interface FileSelectInputProps {
  fileDisplayName: string;
  onFileDisplayNameChange: (name: string) => void;
  onFileChange: (file: File | null) => void;
  accept?: string;
  placeholder?: string;
  maxSizeInMB?: number;
  onFileError?: (error: string) => void;
  fileError?: string;
  disabled?: boolean;
  optional?: boolean;
}

export const FileSelectInput: React.FC<FileSelectInputProps> = ({
  fileDisplayName,
  onFileDisplayNameChange,
  onFileChange,
  accept = "*",
  placeholder = "선택된 파일 없음",
  maxSizeInMB = 10,
  onFileError,
  fileError,
  disabled = false,
  optional = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // 파일 크기 체크 (MB 단위)
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        onFileError?.(`파일 크기는 ${maxSizeInMB}MB 이하여야 합니다.`);
        onFileDisplayNameChange('');
        onFileChange(null);
        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      onFileDisplayNameChange(file.name);
      onFileChange(file);
      onFileError?.(''); // 에러 메시지 초기화
    } else {
      onFileDisplayNameChange('');
      onFileChange(null);
    }
  };

  const handleButtonClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Container>
      <Label>파일 선택</Label>
      <FileInputContainer>
        <DisplayInput
          type="text"
          value={fileDisplayName}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
        />
        <SelectButton type="button" onClick={handleButtonClick} disabled={disabled}>
          {disabled ? '기존 파일' : optional ? '파일 선택' : '파일 선택'}
        </SelectButton>
        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
        />
      </FileInputContainer>
      <ErrorContainer>
        {fileError && <ErrorMessage>{fileError}</ErrorMessage>}
      </ErrorContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--gap-8);
`;

const Label = styled.label`
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-500);
  color: var(--color-lightblack);
`;

const FileInputContainer = styled.div`
  position: relative;
  display: flex;
`;

const DisplayInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 88px;
  border: 0.75px solid var(--color-gray);
  border-radius: 3.75px;
  font-size: var(--font-size-14);
  outline: none;
  background-color: var(--color-white);

  &:focus {
    border: 0.75px solid #96c;
    box-shadow: 0 0 2.25px 2.25px rgba(153, 102, 204, 0.10);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SelectButton = styled.button`
  position: absolute;
  left: 8px;
  top: 50%;
  width: 72px;
  height: 24px;
  transform: translateY(-50%);
  padding: 6px 12px;
  background: ${props => props.disabled ? '#f3f4f6' : 'rgba(0, 0, 0, 0.10)'};
  color: ${props => props.disabled ? '#6b7280' : '#374151'};
  border: 0.375px solid ${props => props.disabled ? '#d1d5db' : '#000'};
  border-radius: 1.5px;
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-400);
  white-space: nowrap;
  transition: all 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};

  &:hover {
    background: ${props => props.disabled ? '#f3f4f6' : '#d1d5db'};
    border-color: ${props => props.disabled ? '#d1d5db' : '#4b5563'};
  }

  &:active {
    background: ${props => props.disabled ? '#f3f4f6' : '#e5e7eb'};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 0.5px #8b5cf6;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ErrorContainer = styled.div`
  min-height: 20px;
  display: flex;
  align-items: center;
  margin-top: -6px;
  margin-bottom: 8px;
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: 12px;
  font-weight: var(--font-weight-400);
`;
