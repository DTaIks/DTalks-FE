import styled from 'styled-components';

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
  if (!open) return null;

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <ModalContent>
          <ModalHeader>
            <ModalTitle>시스템 관리자 관리</ModalTitle>
          </ModalHeader>
          
          {selectedUser && (
            <ModalBody>
              <RoleInfoSection>
                <RoleInfoLeft>
                  <RoleImage src={selectedUser.image} alt={selectedUser.name} />
                  <RoleTextInfo>
                    <RoleName>{selectedUser.name}</RoleName>
                    <RoleEngName>{selectedUser.engName}</RoleEngName>
                  </RoleTextInfo>
                </RoleInfoLeft>
                <RoleInfoRight>
                  현재 {selectedUser.userCount}의 사용자가 이 권한을 가지고 있습니다.
                </RoleInfoRight>
              </RoleInfoSection>

              <SearchSection>
                <SearchLabel>사용자 검색</SearchLabel>
                <SearchInput placeholder="사용자를 검색하세요." />
              </SearchSection>

              <UserTableSection>
                <UserTable>
                  <thead>
                    <tr>
                      <UserTableHeader>이름</UserTableHeader>
                      <UserTableHeader>이메일</UserTableHeader>
                      <UserTableHeader>부서</UserTableHeader>
                      <UserTableHeader>역할</UserTableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    <UserTableRow>
                      <UserTableCell>이주원</UserTableCell>
                      <UserTableCell>
                        <EmailLink href="mailto:lee@gachon.ac.kr">lee@gachon.ac.kr</EmailLink>
                      </UserTableCell>
                      <UserTableCell>디자인팀</UserTableCell>
                      <UserTableCell>사용자</UserTableCell>
                    </UserTableRow>
                    <UserTableRow>
                      <UserTableCell>정지민</UserTableCell>
                      <UserTableCell>
                        <EmailLink href="mailto:jmjung@gachon.ac.kr">jmjung@gachon.ac.kr</EmailLink>
                      </UserTableCell>
                      <UserTableCell>개발팀</UserTableCell>
                      <UserTableCell>사용자</UserTableCell>
                    </UserTableRow>
                    <UserTableRow>
                      <UserTableCell>김동섭</UserTableCell>
                      <UserTableCell>
                        <EmailLink href="mailto:dongsub@gachon.ac.kr">dongsub@gachon.ac.kr</EmailLink>
                      </UserTableCell>
                      <UserTableCell>인프라팀</UserTableCell>
                      <UserTableCell>사용자</UserTableCell>
                    </UserTableRow>
                  </tbody>
                </UserTable>
              </UserTableSection>

              <SaveButton onClick={onClose}>저장</SaveButton>
            </ModalBody>
          )}
        </ModalContent>
      </ModalContainer>
    </Overlay>
  );
};

export default PermissionModal;

const Overlay = styled.div`
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
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 1158px;
  height: 905px;
  flex-shrink: 0;
  background: var(--modal-container-bg);
  border-radius: var(--modal-border-radius);
  box-shadow: var(--modal-box-shadow);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: var(--modal-padding);
  max-width: var(--modal-max-width);
  max-height: var(--modal-max-height);
  overflow: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 32px;
  background: none;
  border: none;
  font-size: var(--modal-close-button-size);
  color: var(--modal-close-button-color);
  cursor: pointer;
  z-index: 1;
`;

const ModalContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  margin: 0;
`;

const ModalBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
`;

const RoleInfoSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const RoleInfoLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RoleInfoRight = styled.div`
  font-size: 1rem;
  color: #666;
`;

const RoleTextInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const RoleName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #222;
  margin: 0;
`;

const RoleEngName = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
`;

const RoleImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #ffa800;
  object-fit: cover;
`;

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SearchLabel = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  &:focus {
    border-color: #a084e8;
  }
`;

const UserTableSection = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  color: #333;
`;

const UserTableHeader = styled.th`
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  padding: 0.75rem 0.5rem;
  text-align: left;
  font-weight: 600;
  color: #555;
  border-bottom: 1px solid #eee;
`;

const UserTableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f0f2f5;
  }
`;

const UserTableCell = styled.td`
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #eee;
`;

const EmailLink = styled.a`
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: #a084e8;
  color: #fff;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  align-self: flex-end;
  &:hover {
    background: #8b6fd8;
  }
`; 