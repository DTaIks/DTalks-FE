import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import Button from './Button';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  submitDisabled?: boolean;
}

export const UploadBaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = '저장',
  submitDisabled = false,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleSubmit = useCallback(() => {
    if (onSubmit && !submitDisabled) {
      onSubmit();
    }
  }, [onSubmit, submitDisabled]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <h2>{title}</h2>
          <CloseButton
            onClick={onClose}
            type="button"
          >
            ×
          </CloseButton>
        </ModalHeader>

        <ModalContent>{children}</ModalContent>

        {onSubmit && (
          <ModalFooter>
            <Button
              variant="primary"
              text={`${submitText}`}
              onClick={handleSubmit}
              disabled={submitDisabled}
              width="120px"
              height="44px"
              fontSize="16px"
            />
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

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
  border-radius: 15px;
  width: 420px;
  height: 740px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0px;
  flex-shrink: 0;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #222;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;
  margin-bottom: 12px;

  &:hover {
    color: #1f2937;
  }
`;

const ModalContent = styled.div`
  padding: 24px;
  flex: 1;
  min-height: 0;
`;

const ModalFooter = styled.div`
  padding: 0 20px 20px 20px;
  display: flex;
  justify-content: flex-end;
  background: var(--color-white);
  flex-shrink: 0;
`;
