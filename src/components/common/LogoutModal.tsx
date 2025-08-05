import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ProfileImageSrc from "@/assets/common/Profile.png";
import { useAuthStore } from "@/store/authStore";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleScrollPrevention = () => {
    document.body.style.overflow = 'hidden';
  };

  const handleScrollRestoration = () => {
    document.body.style.overflow = 'unset';
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  useEffect(() => {
    if (isOpen) {
      handleScrollPrevention();
    } else {
      handleScrollRestoration();
    }

    return () => {
      handleScrollRestoration();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <ProfileAvatar>
          <AvatarImage src={ProfileImageSrc} alt="Profile" />
        </ProfileAvatar>
        
        <UserName>admin</UserName>
        <UserEmail>admin@email.com</UserEmail>
        
        <LogoutButton onClick={handleLogout}>
          로그아웃
        </LogoutButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LogoutModal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-gray-100);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
`;

const ModalContent = styled.div`
  background-color: var(--color-white);
  border-radius: var(--br-12);
  box-shadow: 0 4px 20px var(--color-gray-200);
  width: 400px;
  height: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--padding-32) var(--padding-24);
  position: relative;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: var(--font-size-24);
  cursor: pointer;
  color: var(--color-darkgray);
  padding: var(--padding-6);
  border-radius: var(--br-6);
  transition: color 0.2s ease;
  position: absolute;
  right: var(--gap-16);
  top: var(--gap-16);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--color-dimgray);
  }
`;

const ProfileAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color-lightbluegray);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--gap-20);
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const UserName = styled.h2`
  font-size: var(--font-size-20);
  font-weight: 700;
  color: var(--color-dimgray);
  margin: 0 0 var(--gap-8) 0;
  text-align: center;
`;

const UserEmail = styled.p`
  font-size: var(--font-size-16);
  color: var(--color-darkgray);
  margin: 0 0 var(--gap-40) 0;
  text-align: center;
`;

const LogoutButton = styled.button`
  background-color: var(--color-mediumpurple-400);
  color: var(--color-white);
  border: none;
  border-radius: var(--br-8);
  padding: var(--padding-12) var(--padding-32);
  font-size: var(--font-size-16);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 200px;
  margin-top: 0;
  z-index: 1003;
  position: relative;

  &:hover {
    background-color: #6b4f8f;
  }

  &:active {
    background-color: var(--color-mediumpurple-200);
  }
`;