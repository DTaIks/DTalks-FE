import styled from 'styled-components';

interface FooterSectionProps {
  selectedCount: number;
  onSave: () => void;
  isSaving: boolean;
  error?: string | null; 
}

export const RoleFooterSection = ({ selectedCount, onSave, isSaving, error }: FooterSectionProps) => (
  <>
    {error && (
      <ErrorContainer>
        <ErrorMessage>
          {error}
        </ErrorMessage>
      </ErrorContainer>
    )}
    <ButtonContainer>
      <Button 
        onClick={onSave}
        disabled={selectedCount === 0 || isSaving}
      >
        {isSaving ? '저장 중' : '저장'}
      </Button>
    </ButtonContainer>
  </>
);

const ErrorContainer = styled.div`
  position: absolute;
  bottom: 40px;
  left: 36px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 36px;
  right: 36px;
`;

const ErrorMessage = styled.div`
  padding: 8px 12px;
  color: var(--color-error);
  font-size: 16px;
`;

const Button = styled.button`
  width: 132px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 6px;
  background: #8061B0;
  border: none;
  color: white;
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
