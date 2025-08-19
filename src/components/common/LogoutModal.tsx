import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProfileImageSrc from "@/assets/common/Profile.png";
import { useBodyScrollLock } from "@/hooks/useScrollControl";
import { authAPI } from "@/api/authAPI";
import { useLogoutMutation } from "@/query/useAuthQueries";
import { performLogoutCleanup } from "@/utils/logoutUtils";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const logoutMutation = useLogoutMutation();
  const [profileName, setProfileName] = useState<string>("admin");

  // 모달 열릴 때 스크롤 락
  useBodyScrollLock(isOpen);

  // 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authAPI.getProfile();
        setProfileName(profileData.name);
      } catch (error) {
        // 에러 발생 시 기본값 유지
        setProfileName('admin');
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출 (성공/실패와 관계없이 clearAllData 호출됨)
      await logoutMutation.mutateAsync();
    } catch {
      // 401 에러는 이미 로그아웃된 상태이므로 정상 처리
      // clearAllData는 mutation의 onError에서 호출됨
    } finally {
      // 모달 닫기
      onClose();
      // 로그인 페이지로 리다이렉트
      performLogoutCleanup();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <ProfileAvatar>
          <AvatarImage src={ProfileImageSrc} alt="Profile" />
        </ProfileAvatar>
        
        <UserName>{profileName}</UserName>
        
        <LogoutButton onClick={handleLogout} disabled={logoutMutation.isPending}>
          {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
        </LogoutButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LogoutModal;

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
  margin-bottom: 48px;
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