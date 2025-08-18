import React from 'react';
import styled from 'styled-components';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleBackdropClick}>
      <ModalContainer>
        <CloseButton onClick={onClose}>
          ✕
        </CloseButton>

        <ModalContent>
          <MessageText>
            {errorMessage}
          </MessageText>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ErrorModal;

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
  width: 280px;
  height: 120px;
  flex-shrink: 0;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666666;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease, background-color 0.2s ease;
  
  &:hover {
    color: #333333;
    background-color: #f5f5f5;
  }
`;

const ModalContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MessageText = styled.p`
  font-size: var(--font-size-16);
  color: #222;
  font-weight: var(--font-weight-500);
  text-align: center;
  margin: 0;
  white-space: pre-line;
  line-height: 1.5;
`;
