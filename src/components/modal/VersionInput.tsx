import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { validateSemver } from '@/utils/validation';

interface VersionInputProps {
 version: string;
 onVersionChange: (value: string) => void;
 onBlur?: () => void;
 placeholder?: string;
 showError?: boolean;
 isEditMode?: boolean;
}

export const VersionInput: React.FC<VersionInputProps> = ({ 
  version, 
  onVersionChange, 
  onBlur, 
  placeholder = "1.0.0", 
  showError = false
}) => {
  const [semverInput, setSemverInput] = useState(version);

  // version prop이 변경될 때 semverInput 상태 업데이트
  useEffect(() => {
    setSemverInput(version);
  }, [version]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSemverInput(value);
    onVersionChange(value);
  };

  const handleBlur = () => {
   if (onBlur) {
     onBlur();
   }
 };

 const isCurrentValueValid = validateSemver(semverInput);
 const isEmpty = semverInput.trim() === '';

 return (
   <VersionContainer>
     <Label>버전</Label>
     <InputWrapper $isValid={isCurrentValueValid}>
       <VersionPrefix>v</VersionPrefix>
       <Input
         type="text"
         value={semverInput}
         onChange={handleChange}
         onBlur={handleBlur}
         placeholder={placeholder}
       />
     </InputWrapper>
     <ErrorContainer>
       {showError && (isEmpty || !isCurrentValueValid) && (
         <Error>
           {isEmpty ? '버전을 입력하세요' : '올바른 버전 형식을 입력하세요 (ex:1.0.0)'}
         </Error>
       )}
     </ErrorContainer>
   </VersionContainer>
 );
};

const VersionContainer = styled.div`
 width: 370px;
 display: flex;
 flex-direction: column;
 gap: var(--gap-8);
`;

const Label = styled.label`
 font-size: var(--font-size-14);
 font-weight: var(--font-weight-500);
 color: var(--color-black);
`;

const InputWrapper = styled.div<{ $isValid: boolean }>`
 position: relative;
 display: flex;
 align-items: center;
 border: 0.75px solid var(--color-gray);
 border-radius: 3.75px;
 transition: all 0.2s ease;
 
 &:focus-within {
   border: 0.75px solid #96c;
   box-shadow: 0 0 2.25px 2.25px rgba(153, 102, 204, 0.10);
 }
`;

const VersionPrefix = styled.span`
 padding: 12px 4px 12px 12px;
 font-size: var(--font-size-14);
 color: var(--color-black);
 user-select: none;
 pointer-events: none;
`;

const Input = styled.input`
 flex: 1;
 padding: 12px 12px 12px 0;
 border: none;
 font-size: var(--font-size-14);
 outline: none;
 background: transparent;
 
 &::placeholder {
   color: #9ca3af;
 }
`;

const ErrorContainer = styled.div`
  min-height: 20px;
  display: flex;
  align-items: center;
  margin-top: -6px;
  margin-bottom: 10px;
`;

const Error = styled.div`
font-size: var(--font-size-12);
color: var(--color-error);
font-weight: var(--font-weight-400);
`;
