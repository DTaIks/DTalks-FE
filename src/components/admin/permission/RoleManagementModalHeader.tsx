import styled from 'styled-components';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

const ModalHeader = ({ title, onClose }: ModalHeaderProps) => {
  return (
    <HeaderContainer>
      <ModalTitle>{title}</ModalTitle>
      <CloseButton onClick={onClose}>×</CloseButton>
    </HeaderContainer>
  );
};

export default ModalHeader;

const HeaderContainer = styled.h2`
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

const ModalTitle = styled.span`
  color: var(--color-black);
  font-family: var(--font-pretendard);
  font-size: var(--font-size-19);
  font-weight: 700;
  padding-left: 36px;
  display: flex;
  align-items: center;
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
  margin-left: auto;
  margin-right: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #1f2937;
  }
`; 