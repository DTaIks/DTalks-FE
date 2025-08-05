import React from 'react';
import styled from 'styled-components';
import { validateSemver, semverInput } from '@/utils/validation';

interface VersionInputProps {
 version: string;
 onVersionChange: (value: string) => void;
 onBlur?: () => void;
 placeholder?: string;
 isValid?: boolean;
 showError?: boolean;
}

export const VersionInput: React.FC<VersionInputProps> = ({
 version,
 onVersionChange,
 onBlur,
 placeholder = "1.0.0",
 showError = false,
}) => {
 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const validInput = semverInput(e.target.value);
   onVersionChange(validInput);
 };

 const handleBlur = () => {
   if (onBlur) {
     onBlur();
   }
 };

 const isCurrentValueValid = validateSemver(version);
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
         onBlur={handleBlur}
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

const Error = styled.div`
 font-size: var(--font-size-10);
 color: var(--color-error);
`;
