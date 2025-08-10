import styled from 'styled-components';

interface ActionSectionProps {
  selectedCount: number;
  onSave: () => void;
  isSaving: boolean;
}

export const ActionSection = ({ selectedCount, onSave, isSaving }: ActionSectionProps) => (
  <ActionContainer>
    <ActionButton 
      onClick={onSave}
      disabled={selectedCount === 0 || isSaving}
    >
      {isSaving ? '저장 중' : '저장'}
    </ActionButton>
  </ActionContainer>
);

const ActionContainer = styled.div`
  position: absolute;
  bottom: 36px;
  right: 36px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ActionButton = styled.button`
  width: 132px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 6px;
  background: #8061B0;
  border: none;
  color: white;
  font-family: var(--font-pretendard);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: #6b4f8f;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;
