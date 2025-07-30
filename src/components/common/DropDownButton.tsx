import React, { useState } from 'react';
import styled from 'styled-components';

interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropDownButtonProps {
  items?: DropdownItem[];
}

const DropDownButton: React.FC<DropDownButtonProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const defaultDropdownItems: DropdownItem[] = [
    {
      label: '다운로드',
      onClick: () => {
        setIsOpen(false);
      }
    },
    {
      label: '버전 관리',
      onClick: () => {
        setIsOpen(false);
      }
    },
    {
      label: '보관',
      onClick: () => {
        setIsOpen(false);
      }
    }
  ];

  const dropdownItems = items || defaultDropdownItems;

  const handleItemClick = (item: DropdownItem) => {
    item.onClick();
    setIsOpen(false);
  };

  return (
    <Container>
      <ButtonContainer>
        <MenuButton
          onClick={handleToggle}
          className={isOpen ? 'active' : ''}
        >
          <DotsContainer>
            <Dot />
            <Dot />
            <Dot />
          </DotsContainer>
          <Hover />
        </MenuButton>
                
        {isOpen && (
          <DropdownMenu>
            {dropdownItems.map((item, index) => (
              <DropdownItem
                key={index}
                onClick={() => handleItemClick(item)}
              >
                {item.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </ButtonContainer>
            
      {isOpen && (
        <Backdrop onClick={() => setIsOpen(false)} />
      )}
    </Container>
  );
};

export default DropDownButton;

const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Container = styled.div`
  padding: 2rem;
`;

const MenuButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: transparent;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:focus {
    outline: none;
  }
`;

const DotsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: relative;
  z-index: 2;
`;

const Dot = styled.div`
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 50%;
  background-color: #666;
`;

const Hover = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 100%;
  height: 100%;
  background-color: #f5f0fa;
  border-radius: 50%;
  transition: transform 0.2s ease;
  z-index: 1;

  ${MenuButton}:hover &,
  ${MenuButton}.active & {
    transform: translate(-50%, -50%) scale(1);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  width: 100px;
  height: auto;
  min-height: 120px;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid rgba(153, 102, 204, 0.20);
  background: #FFF;
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--color-black);
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #f5f0fa;
    color: #9966CC;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 5;
`;
