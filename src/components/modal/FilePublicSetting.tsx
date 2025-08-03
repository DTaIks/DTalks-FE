import React from 'react';
import styled from 'styled-components';

interface FilePublicSettingProps {
  isPublic: boolean;
  onPublicChange: (value: boolean) => void;
  label?: string;
}

export const PublicSetting: React.FC<FilePublicSettingProps> = ({
  isPublic,
  onPublicChange,
  label = "공개 설정"
}) => {
  const handleToggle = () => {
    onPublicChange(!isPublic);
  };

  return (
    <PublicContainer>
      <Label>{label}</Label>
      <CheckboxContainer>
        <HiddenCheckbox
          type="checkbox"
          checked={isPublic}
          onChange={handleToggle} 
          aria-label="활성화" 
        />
        <StyledCheckbox checked={isPublic} aria-hidden="true" />
        <CheckboxLabel>활성화</CheckboxLabel>
      </CheckboxContainer>
    </PublicContainer>
  );
};

const PublicContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--gap-8);
  margin-left: 24px;
`;

const Label = styled.label`
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-500);
  color: var(--color-lightblack);
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-8);
  margin-top: 12px;
  position: relative; 
`;

const HiddenCheckbox = styled.input`
  opacity: 0;
  position: absolute;
  width: 14px;
  height: 14px;
  cursor: pointer;
  z-index: 1;
  
  &:focus-visible + div {
    box-shadow: 0 0 0 1px #8b5cf6;
  }
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  width: 14px;
  height: 14px;
  border: 1px solid ${props => props.checked ? '#8061B0' : '#d1d5db'};
  border-radius: var(--br-4);
  background-color: ${props => props.checked ? '#8061B0' : '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; 
  transition: all 0.1s ease;

  &::after {
    content: '✓';
    color: var(--color-white);
    font-size: var(--font-size-12);
    font-weight: var(--font-weight-500);
    opacity: ${props => props.checked ? 1 : 0};
    transition: opacity 0.1s ease;
  }
`;

const CheckboxLabel = styled.span`
  font-size: var(--font-size-14);
  color: var(--color-lightblack);
  font-weight: var(--font-weight-400);
  cursor: pointer;
`;
