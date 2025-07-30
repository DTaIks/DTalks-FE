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
          onChange={() => {}}
        />
        <StyledCheckbox checked={isPublic} onClick={handleToggle} />
        <CheckboxLabel>활성화</CheckboxLabel>
      </CheckboxContainer>
    </PublicContainer>
  );
};

const PublicContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 24px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #222;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;

const HiddenCheckbox = styled.input`
  opacity: 0;
  position: absolute;
  pointer-events: none;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  width: 14px;
  height: 14px;
  aspect-ratio: 13.50/13.50;
  border: 1px solid ${props => props.checked ? '#8061B0' : '#d1d5db'};
  border-radius: 4px;
  background-color: ${props => props.checked ? '#8061B0' : '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s ease;

  &:hover {
    border-color: #8b5cf6;
  }

  &::after {
    content: '✓';
    color: var(--color-white);
    font-size: 12px;
    font-weight: bold;
    opacity: ${props => props.checked ? 1 : 0};
    transition: opacity 0.1s ease;
  }
`;

const CheckboxLabel = styled.span`
  font-size: 14px;
  color: #222;
  font-weight: 400;
`;
