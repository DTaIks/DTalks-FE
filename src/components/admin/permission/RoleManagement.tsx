import styled from 'styled-components';
import React from 'react';
import Roll1 from '@/assets/permission/PermissionRoll1.svg';
import { usePermissionStore } from '@/store/permissionStore';
import type { PermissionUser } from '@/types/permission';
import ModalHeader from '@/components/admin/permission/RoleManagementModalHeader';
import UserTable from '@/components/admin/permission/RoleManagementUserTable';

interface RoleManagementProps {
  open: boolean;
  onClose: () => void;
  selectedUser: PermissionUser | null;
}

const RoleManagement = ({ open, onClose, selectedUser }: RoleManagementProps) => {
  const { clearSelectedRows } = usePermissionStore();

  // 모달이 열릴 때 선택 상태 초기화
  React.useEffect(() => {
    if (open) {
      clearSelectedRows();
    }
  }, [open, clearSelectedRows]);

  // 테이블 데이터
  const tableHeaders = ['이름', '이메일', '부서', '역할'];
  const tableData = [
    { name: '이주원', email: 'lee@gachon.ac.kr', department: '디자인팀', role: '사용자' },
    { name: '정지민', email: 'jmjung@gachon.ac.kr', department: '개발팀', role: '사용자' },
    { name: '김동섭', email: 'dongsub@gachon.ac.kr', department: '인프라팀', role: '사용자' },
    { name: '김유경', email: 'msaws@gachon.ac.kr', department: 'aws팀', role: 'aws' },
  ];

  if (!open) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader 
          title={`${selectedUser?.roleName || "관리자"} 관리`}
          onClose={onClose}
        />
        
        <ModalSection>
          <ModalContent>
            <RoleIcon src={selectedUser?.image || Roll1} alt="role" />
            <RoleInfo>
              <RoleName>{selectedUser?.roleName || "관리자"}</RoleName>
              <RoleEngName>{selectedUser?.roleNameEn || "Administrator"}</RoleEngName>
            </RoleInfo>
          </ModalContent>
          <UserCountText>현재 {selectedUser?.roleUserCount || 1}명의 사용자가 이 권한을 가지고 있습니다.</UserCountText>
        </ModalSection>
        
        <ModalSection2>
          <ModalSection2Header>
            <HeaderTitle>사용자 검색</HeaderTitle>
            <SearchInput placeholder="사용자를 검색하세요" />
          </ModalSection2Header>
          
          <UserTable tableHeaders={tableHeaders} tableData={tableData} />
        </ModalSection2>
        
        <ActionButton>저장</ActionButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default RoleManagement;

// 모달 오버레이
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

// 모달 컨테이너
const ModalContainer = styled.div`
  width: 868px;
  height: 678px;
  flex-shrink: 0;
  border-radius: 19.5px;
  background: #FFF;
  position: relative;
`;

// 첫 번째 섹션
const ModalSection = styled.div`
  width: 796.5px;
  height: 97.5px;
  flex-shrink: 0;
  border-radius: 18.75px;
  background: #F5F5F5;
  margin-top: 36px;
  margin-left: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 모달 내용
const ModalContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 36px;
`;

// 역할 아이콘
const RoleIcon = styled.img`
  width: 33.6px;
  height: 33.6px;
  border-radius: 8.4px;
  object-fit: cover;
`;

// 역할 정보
const RoleInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

// 역할 이름
const RoleName = styled.span`
  font-size: 16.8px;
  font-weight: 700;
  color: var(--color-black);
  width: 100%;
  text-align: left;
`;

// 역할 영문 이름
const RoleEngName = styled.span`
  font-size: 14px;
  color: #888;
  width: 100%;
  text-align: left;
`;

// 사용자 수 텍스트
const UserCountText = styled.span`
  color: var(--color-black);
  font-family: var(--font-pretendard);
  font-size: var(--font-size-14);
  font-weight: 500;
  margin-right: 36px;
`;

// 두 번째 섹션
const ModalSection2 = styled.div`
  width: 796.5px;
  height: 328.5px;
  flex-shrink: 0;
  border-radius: 18.75px;
  border: 1.5px solid #E9E9E9;
  margin-top: 24px;
  margin-left: 36px;
`;

// 섹션 헤더
const ModalSection2Header = styled.div`
  width: 796.5px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 18.75px 18.75px 0 0;
  border-bottom: 1.5px solid #E9E9E9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 36px;
  padding-right: 36px;
  box-sizing: border-box;
`;

// 헤더 제목
const HeaderTitle = styled.span`
  color: #000;
  font-size: 16.5px;
  font-weight: 500;
`;

// 검색 입력창
const SearchInput = styled.input`
  width: 200px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 3.75px;
  border: 0.75px solid #666;
  padding: 0 12px;
  font-family: var(--font-pretendard);
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #999;
  }
`;

// 액션 버튼
const ActionButton = styled.button`
  width: 132px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 6px;
  background: #8061B0;
  border: none;
  color: white;
  font-family: var(--font-pretendard);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  position: absolute;
  bottom: 36px;
  right: 36px;
  transition: background-color 0.2s ease;

  &:hover {
    background: #6b4f8f;
  }
`;