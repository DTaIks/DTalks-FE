import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface FileCategoryProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label?: string;
}

export const FileCategory: React.FC<FileCategoryProps> = ({
  value,
  onChange,
  options,
  label = "카테고리"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value && options.length > 0) {
      onChange(options[0]);
    }
  }, [value, onChange, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const filteredOptions = options;

  return (
    <Container ref={dropdownRef}>
      <Label>{label}</Label>
      <DropdownButton onClick={handleToggle} isOpen={isOpen}>
        <ButtonText>
          {value || (options.length > 0 ? options[0] : '')}
        </ButtonText>
        <ArrowIcon isOpen={isOpen}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ArrowIcon>
      </DropdownButton>
      
      {isOpen && (
        <DropdownList>
          {filteredOptions.map((option, index) => (
            <DropdownItem
              key={index}
              onClick={() => handleOptionClick(option)}
              isSelected={option === value}
            >
              {option}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 370px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--color-black);
`;

const DropdownButton = styled.button<{ isOpen: boolean }>`
  width: 100%;
  padding: 12px;
  border: 0.75px solid #666;
  border-radius: 3.75px;
  background-color: white;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;

  &:focus {
    border: 0.75px solid #96C;
    box-shadow: 0 0 2.25px 2.25px rgba(153, 102, 204, 0.10);
  }

  ${props => props.isOpen && `
    border: 0.75px solid #96C;
    box-shadow: 0 0 2.25px 2.25px rgba(153, 102, 204, 0.10);
  `}
`;

const ButtonText = styled.span`
  color: var(--color-black);
`;

const ArrowIcon = styled.div<{ isOpen: boolean }>`
  color: #666;
  transition: transform 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => props.isOpen && `
    transform: rotate(180deg);
  `}
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 0.75px solid #e5e7eb;
  border-radius: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  max-height: 200px;
  margin: 0;
  padding: 0;
  list-style: none;
  box-sizing: border-box;
`;

const DropdownItem = styled.li<{ isSelected?: boolean }>`
  padding: 12px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;

  ${props => props.isSelected && `
    background: rgba(153, 102, 204, 0.1);
    color: #9966CC;
    font-weight: 500;
  `}

  &:hover {
    background: rgba(153, 102, 204, 0.05);
    color: #9966CC;
  }

  &:first-child {
    border-top-left-radius: 3.75px;
    border-top-right-radius: 3.75px;
  }

  &:last-child {
    border-bottom-left-radius: 3.75px;
    border-bottom-right-radius: 3.75px;
  }
`;
