import React, { useRef } from 'react';
import styled from 'styled-components';

interface FileSelectInputProps {
  fileDisplayName: string;
  onFileDisplayNameChange: (name: string) => void;
  onFileChange: (file: File | null) => void;
  accept?: string;
  placeholder?: string;
}

export const FileSelectInput: React.FC<FileSelectInputProps> = ({
  fileDisplayName,
  onFileDisplayNameChange,
  onFileChange,
  accept = "*",
  placeholder = "선택된 파일 없음"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onFileDisplayNameChange(file.name);
      onFileChange(file);
    } else {
      onFileDisplayNameChange('');
      onFileChange(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
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
        />
        <SelectButton type="button" onClick={handleButtonClick}>
          파일 선택
        </SelectButton>
        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
        />
      </FileInputContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--gap-8);
  margin-bottom: 20px;
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
  background: rgba(0, 0, 0, 0.10);
  color: #374151;
  border: 0.375px solid #000;
  border-radius: 1.5px;
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-400);
  white-space: nowrap;
  transition: all 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #d1d5db;
    border-color: #4b5563;
  }

  &:active {
    background: #e5e7eb;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 0.5px #8b5cf6;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;
