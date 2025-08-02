import styled from 'styled-components';
import React from 'react';
import Roll1 from '../../../assets/permission/Roll.svg';
import { usePermissionStore } from '../../../store/permissionStore';

interface PermissionUser {
  roleId: number;
  image: string;
  roleName: string;
  roleNameEn: string;
  description: string;
  roleUserCount: number;
  isActive: string;
}

interface RoleManagementProps {
  open: boolean;
  onClose: () => void;
  selectedUser: PermissionUser | null;
}

const RoleManagement = ({ open, onClose, selectedUser }: RoleManagementProps) => {
  const { selectedRows, toggleSelectedRow, clearSelectedRows } = usePermissionStore();

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
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{selectedUser?.roleName || "관리자"} 관리</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
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
          
          <UserTable>
            <TableHeader>
              {tableHeaders.map((header, index) => (
                <HeaderCell key={index}>{header}</HeaderCell>
              ))}
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow 
                  key={index}
                  selected={selectedRows.includes(index)}
                  onClick={() => toggleSelectedRow(index)}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </UserTable>
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
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
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

// 모달 헤더
const ModalHeader = styled.h2`
  width: 868px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 19.5px 19.5px 0 0;
  border-bottom: 1.5px solid #E9E0F0;
  background: #FFF;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
`;

// 모달 제목
const ModalTitle = styled.span`
  color: var(--color-black);
  font-family: var(--font-pretendard);
  font-size: var(--font-size-19);
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  padding-left: 36px;
  display: flex;
  align-items: center;
`;

// 닫기 버튼
const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;
  margin-left: auto;
  margin-right: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #1f2937;
  }
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
  font-style: normal;
  font-weight: 500;
  line-height: normal;
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
  font-style: normal;
  font-weight: 500;
  line-height: normal;
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

// 사용자 테이블
const UserTable = styled.div`
  width: 100%;
  margin-top: 24px;
`;

// 테이블 헤더
const TableHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #E9E0F0;
  padding-bottom: 12px;
  margin-bottom: 8px;
`;

// 헤더 셀
const HeaderCell = styled.div`
  flex: 1;
  color: #000;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  margin-top: -10px;
  
  &:first-child {
    padding-left: 36px;
  }
  
  &:nth-child(3) {
    padding-left: 36px;
  }
`;

// 테이블 바디
const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 테이블 행
const TableRow = styled.div<{ selected?: boolean }>`
  display: flex;
  padding: 12px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  
  ${props => props.selected && `
    border: 1px solid #764ba2;
    background-color: rgba(118, 75, 162, 0.03);
    box-shadow: 0 2px 8px rgba(118, 75, 162, 0.1);
  `}
`;

// 테이블 셀
const TableCell = styled.div`
  flex: 1;
  color: #000;
  font-size: 16px;
  text-align: left;
  
  &:first-child {
    padding-left: 36px;
  }
  
  &:nth-child(3) {
    padding-left: 36px;
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