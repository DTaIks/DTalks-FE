import React from 'react';
import styled from 'styled-components';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  type: 'archive' | 'download';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fileName,
  type
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getActionText = () => {
    return type === 'archive' ? '보관합니다' : '다운로드합니다';
  };

  return (
    <ModalOverlay onClick={handleBackdropClick}>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <ModalContent>
          <MessageText>
            {fileName}을 {getActionText()}.
          </MessageText>
        </ModalContent>
        
        <ButtonContainer>
          <CancelButton onClick={onClose}>
            취소
          </CancelButton>
          <ConfirmButton onClick={handleConfirm}>
            확인
          </ConfirmButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ConfirmModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(3.75px);
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: var(--color-white);
  border-radius: 11.25px;
  padding: var(--padding-32);
  width: 540px;
  height: 180px;
  flex-shrink: 0;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--padding-4);
  font-size: var(--font-size-32);
  color: #6b7280;
  border-radius: 4px;
`;

const ModalContent = styled.div``;

const MessageText = styled.p`
  font-size: 20px;
  color: #222;
  font-weight: 500;
  margin-top: 52px;
  margin-left: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 72px;
`;

const BaseButton = styled.button`
  width: 76px;
  height: 32px;
  border-radius: 3.75px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const CancelButton = styled(BaseButton)`
  background: white;
  border: 0.75px solid #8061B0;
  color: #8061B0;
`;

const ConfirmButton = styled(BaseButton)`
  background: #8061B0;
  border: 0.75px solid #8061B0;
  color: white;
  
  &:hover {
    background-color: #553c9a;
    border-color: #553c9a;
  }
`;
