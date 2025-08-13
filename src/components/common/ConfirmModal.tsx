import React from 'react';
import styled from 'styled-components';
import Button from '@/components/common/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  type: 'archive' | 'download' | 'restore';
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fileName,
  type,
  isLoading = false
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
    switch (type) {
      case 'archive':
        return '보관합니다';
      case 'download':
        return '다운로드합니다';
      case 'restore':
        return '복원합니다';
      default:
        return '처리합니다';
    }
  };

  return (
    <ModalOverlay onClick={handleBackdropClick}>
      <ModalContainer>

        <ModalContent>
          <MessageText>
            {fileName} 을/를 {getActionText()}.
          </MessageText>
        </ModalContent>

        <ButtonContainer>
          <Button
            text="취소"
            onClick={onClose}
            variant="secondary"
            width="140px"
            height="40px"
            fontSize="16px"
            style={{
              borderRadius: '8px',
              color: '#666666',
              backgroundColor: '#F3F3F3'
            }}
          />
          <Button
            text="확인"
            onClick={handleConfirm}
            variant="primary"
            width="140px"
            height="40px"
            fontSize="16px"
            disabled={isLoading}
            style={{
              borderRadius: '8px',
              backgroundColor: '#8061B0',
              border: '0.75px solid #8061B0'
            }}
          />
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
  z-index: 1050;
`;

const ModalContainer = styled.div`
  background: var(--color-white);
  border-radius: 20px;
  padding: 40px;
  width: 320px;
  height: 160px;
  flex-shrink: 0;
  position: relative;
`;

const ModalContent = styled.div`
  width: 320px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MessageText = styled.p`
  font-size: var(--font-size-16);
  color: #222;
  font-weight: var(--font-weight-500);
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: var(--gap-8);
  justify-content: center;
  margin-top: 4px;
`;
