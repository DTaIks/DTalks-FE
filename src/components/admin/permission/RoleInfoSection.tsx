import styled from 'styled-components';
import Roll1 from '@/assets/permission/PermissionRoll1.svg';
import type { PermissionRole } from '@/types/permission';

interface RoleInfoSectionProps {
  selectedUser: PermissionRole | null;
}

export const RoleInfoSection = ({ selectedUser }: RoleInfoSectionProps) => (
  <ModalSection>
    <ModalContent>
      <RoleIcon src={selectedUser?.image || Roll1} alt="role" />
      <RoleInfo>
        <RoleName>{selectedUser?.roleName || "관리자"}</RoleName>
        <RoleEngName>{selectedUser?.roleNameEn || "Administrator"}</RoleEngName>
      </RoleInfo>
    </ModalContent>
    <UserCountText>
      현재 {selectedUser?.roleUserCount || 0}명의 사용자가 이 권한을 가지고 있습니다.
    </UserCountText>
  </ModalSection>
);

const ModalSection = styled.div`
  width: 796.5px;
  height: 97.5px;
  flex-shrink: 0;
  border-radius: 18px;
  background: #F5F5F5;
  margin-top: 24px;
  margin-left: 36px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 36px;
`;

const RoleIcon = styled.img`
  width: 33.6px;
  height: 33.6px;
  border-radius: 8.4px;
  object-fit: cover;
`;

const RoleInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const RoleName = styled.span`
  font-size: 16.8px;
  font-weight: 700;
  color: var(--color-black);
  width: 100%;
  text-align: left;
`;

const RoleEngName = styled.span`
  font-size: 14px;
  color: #888;
  width: 100%;
  text-align: left;
`;

const UserCountText = styled.span`
  color: var(--color-black);
  font-family: var(--font-pretendard);
  font-size: var(--font-size-14);
  font-weight: 500;
  margin-right: 36px;
`;
