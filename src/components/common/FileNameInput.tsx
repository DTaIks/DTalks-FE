import React from 'react';
import styled from 'styled-components';

interface FileNameInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const FileNameInput: React.FC<FileNameInputProps> = ({
  value,
  onChange,
  label = "",
  placeholder = "파일명을 입력하세요"
}) => {
  return (
    <Container>
      <Label>{label}</Label>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 346px;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #000;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 0.75px solid #666;
  border-radius: 3.75px;
  font-size: 14px;
  outline: none;
  transition: all 0.1s ease;

  &:focus {
    border: 0.75px solid #96C;
    box-shadow: 0 0 2.25px 2.25px rgba(153, 102, 204, 0.10);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;
