import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
// @ts-expect-error - verbatimModuleSyntax
import FocusTrap from 'focus-trap-react';
import Button from '@/components/common/Button';
import type { BaseModalProps } from '@/types/modal';

export const UploadBaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = '저장',
  submitDisabled = false,
  isSubmitting = false,
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
    <FocusTrap active={isOpen}>
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
                text={isSubmitting ? '업로드 중...' : submitText}
                onClick={handleSubmit}
                disabled={submitDisabled || isSubmitting}
                width="132px"
                height="44px"
                fontSize="16px"
              />
            </ModalFooter>
          )}
        </ModalContainer>
      </ModalOverlay>
    </FocusTrap>
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
  z-index: 1050;
`;

const ModalContainer = styled.div`
  background: var(--color-white);
  border-radius: var(--br-15);
  width: 420px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px 0px;
  flex-shrink: 0;

  h2 {
    margin: 0;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-600);
    color: var(--color-lightblack);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: var(--font-size-32);
  cursor: pointer;
  color: #6b7280;
  padding: var(--padding-4);
  border-radius: var(--br-4);
  transition: color 0.2s ease;
  margin-bottom: 12px;

  &:hover {
    color: #1f2937;
  }
`;

const ModalContent = styled.div`
  padding: var(--padding-24);
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
