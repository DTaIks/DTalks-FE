import React from 'react';
import styled from 'styled-components';

interface FileNameInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label?: string;
  placeholder?: string;
  showError?: boolean;
}

export const FileNameInput: React.FC<FileNameInputProps> = ({
  value,
  onChange,
  onBlur,
  label = "",
  placeholder = "파일명을 입력하세요",
  showError = false
}) => {
  const getErrorMessage = (): string => {
    if (!showError) return "";
    
    if (value.trim().length === 0) {
      return "파일명을 입력하세요";
    }
    return "";
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  const error = getErrorMessage();
  const hasError = error !== "";

  return (
    <Container>
      <Label>{label}</Label>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        hasError={hasError}
      />
      {error && <Error>{error}</Error>}
    </Container>
  );
};

const Container = styled.div`
  width: 346px;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: var(--gap-8);
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-500);
  color: var(--color-black);
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: var(--padding-12);
  border: 0.75px solid var(--color-gray);
  border-radius: 3.75px;
  font-size: var(--font-size-14);
  outline: none;
  transition: all 0.1s ease;

  &:focus {
    border: 0.75px solid #96C;
    box-shadow: 0 0 2.25px 2.25px rgba(153, 02, 204, 0.10);
    };

  &::placeholder {
    color: #9ca3af;
  }
`;

const Error = styled.div`
  font-size: var(--font-size-10);
  color: var(--color-error);
`;
