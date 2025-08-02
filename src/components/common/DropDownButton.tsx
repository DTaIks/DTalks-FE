import React, { useState } from 'react';
import styled from 'styled-components';

interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropDownButtonProps {
  items: DropdownItem[];
}

const DropDownButton: React.FC<DropDownButtonProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

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
            {items.map((item, index) => (
              <DropdownItemButton
                key={index}
                onClick={() => handleItemClick(item)}
              >
                {item.label}
              </DropdownItemButton>
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
  padding: var(--padding-32);
`;

const MenuButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
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
  gap: var(--gap-4);
  position: relative;
  z-index: 2;
`;

const Dot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--color-gray);
`;

const Hover = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 100%;
  height: 100%;
  background-color: var(--color-lightpurple);
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
  margin-top: 8px;
  width: 100px;
  height: auto;
  min-height: 15vh;
  flex-shrink: 0;
  border-radius: var(--br-10);
  border: 1px solid rgba(153, 102, 204, 0.20);
  background: var(--color-white);
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const DropdownItemButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  font-size: var(--font-size-14);
  color: var(--color-black);
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: var(--color-lightpurple);
    color: var(--color-mediumpurple-300);
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 5;
`;
