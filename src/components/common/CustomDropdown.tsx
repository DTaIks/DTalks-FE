import React, { useState } from "react";
import styled from "styled-components";

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string;
  height?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "선택하세요",
  width = "138px",
  height = "33.75px"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  const selectedOption = options.find(option => option.value === value);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setHoveredIndex(-1);
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(-1);
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <DropdownWrapper>
      <DropdownButton 
        onClick={handleButtonClick}
        width={width}
        height={height}
      >
        <DropdownText>
          {selectedOption ? selectedOption.label : placeholder}
        </DropdownText>
        <DropdownArrow>▼</DropdownArrow>
      </DropdownButton>
      {isOpen && (
        <DropdownList>
          {options.map((option, index) => (
            <DropdownOption
              key={option.value}
              isHovered={hoveredIndex === index}
              onClick={() => handleOptionClick(option.value)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {option.label}
            </DropdownOption>
          ))}
        </DropdownList>
      )}
    </DropdownWrapper>
  );
};

export default CustomDropdown;

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.div<{ width: string; height: string }>`
  width: ${props => props.width};
  height: ${props => props.height};
  border-radius: 3.75px;
  border: 0.75px solid #CCC;
  padding: 0 12px;
  font-family: Pretendard;
  font-size: 15px;
  color: #000;
  background: #FFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-sizing: border-box;
`;

const DropdownText = styled.span`
  flex: 1;
  text-align: left;
`;

const DropdownArrow = styled.span`
  font-size: 12px;
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #FFF;
  border: 0.75px solid #CCC;
  border-top: none;
  border-radius: 0 0 3.75px 3.75px;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const DropdownOption = styled.div<{ isHovered: boolean }>`
  padding: 8px 12px;
  font-family: Pretendard;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  background-color: ${props => props.isHovered ? '#F8F2FB' : '#FFF'};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #F8F2FB;
  }
`; 