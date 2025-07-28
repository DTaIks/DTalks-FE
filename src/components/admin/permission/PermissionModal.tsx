import styled from 'styled-components';
import React, { useState } from 'react';

interface PermissionUser {
  id: number;
  image: string;
  name: string;
  engName: string;
  description: string;
  userCount: string;
  status: string;
}

interface PermissionModalProps {
  open: boolean;
  onClose: () => void;
  selectedUser: PermissionUser | null;
}

const PermissionModal = ({ open, onClose, selectedUser }: PermissionModalProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!open) return null;

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div>
        <h1>PermissionModal</h1>
        <button onClick={handleEditClick}>수정 버튼</button>
      </div>

      {isEditModalOpen && (
        <EditModalOverlay>
          <EditModalContainer>
            <EditModalCloseButton onClick={handleEditModalClose}>×</EditModalCloseButton>
            <EditModalContent>
              <EditModalTitle>역할 수정</EditModalTitle>
              <EditModalBody>
                <p>역할 수정 내용이 여기에 들어갑니다.</p>
              </EditModalBody>
            </EditModalContent>
          </EditModalContainer>
        </EditModalOverlay>
      )}
    </>
  );
};

export default PermissionModal;

const EditModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const EditModalContainer = styled.div`
  width: 868px;
  height: 678px;
  background: #FFF;
  border-radius: 19.5px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const EditModalCloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 32px;
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  z-index: 1;
`;

const EditModalContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const EditModalTitle = styled.h2`
  width: 868.5px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 19.5px 19.5px 0 0;
  border-bottom: 1.5px solid #E9E0F0;
  background: #FFF;
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 2rem 0;
`;

const EditModalBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`; 