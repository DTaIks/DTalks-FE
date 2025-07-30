import React from 'react';
import styled from 'styled-components';

interface VersionInputProps {
  version: string;
  onVersionChange: (value: string) => void;
  placeholder?: string;
  isValid?: boolean;
  showError?: boolean;
}

export const VersionInput: React.FC<VersionInputProps> = ({
  version,
  onVersionChange,
  placeholder = "1.0.0",
  showError = false,
}) => {
  const isValidSemver = (value: string): boolean => {
    const semver = /^\d+\.\d+\.\d+$/;
    return semver.test(value);
  };
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
         
    // 숫자와 점만 허용
    const semverValue = value.replace(/[^0-9.]/g, '');
    const segments = semverValue.split('.');
         
    // 점이 2개를 초과하면 무시
    if (segments.length > 3) {
      return;
    }
         
    // 각 부분이 숫자로만 구성
    for (const part of segments) {
      if (part !== '' && !/^\d+$/.test(part)) {
        return;
      }
    }
         
    // 연속된 점 방지
    if (semverValue.includes('..')) {
      return;
    }
         
    // 점으로 시작 방지
    if (semverValue.startsWith('.')) {
      return;
    }
         
    onVersionChange(semverValue);
  };
 
  const isCurrentValueValid = isValidSemver(version);
  const isEmpty = version.trim() === '';
 
  return (
    <VersionContainer>
      <Label>버전</Label>
      <InputWrapper $isValid={isCurrentValueValid}>
        <VersionPrefix>v</VersionPrefix>
        <Input
          type="text"
          value={version}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </InputWrapper>
      {showError && (isEmpty || !isCurrentValueValid) && (
        <Error>
          {isEmpty ? '버전을 입력하세요' : '올바른 버전 형식을 입력하세요 (ex:1.0.0)'}
        </Error>
      )}
    </VersionContainer>
  );
};

const VersionContainer = styled.div`
  width: 370px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--color-black);
`;

const InputWrapper = styled.div<{ $isValid: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  border: 0.75px solid #666;
  border-radius: 3.75px;
  transition: all 0.2s ease;
     
  &:focus-within {
    border: 0.75px solid #96c;
    box-shadow: 0 0 2.25px 2.25px rgba(153, 102, 204, 0.10);
  }
`;

const VersionPrefix = styled.span`
  padding: 12px 4px 12px 12px;
  font-size: 14px;
  color: var(--color-black);
  user-select: none;
  pointer-events: none;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 12px 12px 0;
  border: none;
  font-size: 14px;
  outline: none;
  background: transparent;
     
  &::placeholder {
    color: #9ca3af;
  }
`;

const Error = styled.div`
  font-size: 10px;
  color: #F0191D;
`;
