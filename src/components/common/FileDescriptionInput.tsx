import React from 'react';
import styled from 'styled-components';

interface FileDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void,
  label?: string;
  placeholder?: string;
  rows?: number;
  showError?: boolean; 
}

export const FileDescriptionInput: React.FC<FileDescriptionInputProps> = ({
  value,
  onChange,
  onBlur,
  label = "",
  placeholder = "파일에 대한 설명을 입력하세요",
  rows = 4,
  showError = false 
}) => {
  const getErrorMessage = (): string => {
    if (!showError) return "";
    
    if (value.length === 0) {
      return "설명이 최소 1자 이상이어야 됩니다";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 225) {
      return;
    }
    onChange(e.target.value);
  };

  const error = getErrorMessage();
  const hasError = error !== "";

  return (
    <Container>
      <Label>{label}</Label>
      <TextareaContainer>
        <Textarea
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          hasError={hasError}
        />
        <BottomRow>
          <Error>{error}</Error>
          <CharacterCount hasError={hasError}>
            {value.length}/225
          </CharacterCount>
        </BottomRow>
      </TextareaContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 346px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: var(--gap-8);
  margin-bottom: 4px;
`;

const Label = styled.label`
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-500);
  color: var(--color-black);
`;

const TextareaContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const BottomRow = styled.div`
  width: 366px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  min-height: 16px;
`;

const CharacterCount = styled.span<{ hasError: boolean }>`
  font-size: var(--font-size-10);
  color: var(--color-gray);
  font-weight: var(--font-weight-400);
`;

const Textarea = styled.textarea<{ hasError: boolean }>`
  width: 100%;
  padding: var(--padding-12);
  border: 0.75px solid var(--color-gray);
  border-radius: 3.75px;
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-400);
  outline: none;
  resize: none;

  &:focus {
    border: 0.75px solid #96C;
    box-shadow: 0 0 2.25px 2.25px rgba(153, 102, 204, 0.10);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Error = styled.span`
  color: var(--color-error);
  font-size: var(--font-size-10);
  font-weight: var(--font-weight-400);
`;
