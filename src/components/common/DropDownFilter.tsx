import { useState } from 'react';
import styled from 'styled-components';

interface DropdownFilterProps<T extends readonly string[]> {
  options: T;
  defaultValue?: T[number];
  onSelect: (selectedValue: T[number]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function DropdownFilter<T extends readonly string[]>({
  options,
  defaultValue,
  onSelect,
  placeholder = "",
  disabled = false
}: DropdownFilterProps<T>) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<T[number] | undefined>(
    defaultValue
  );

  const toggleExpanded = (): void => {
    if (!disabled) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleSelect = (value: T[number]): void => {
    setSelectedValue(value);
    setIsExpanded(false);
    onSelect(value);
  };

  const filteredOptions = options.filter(option => option !== selectedValue);

  return (
    <DropdownContainer>
      <DropdownButton 
        onClick={toggleExpanded}
        disabled={disabled}
        isExpanded={isExpanded}
      >
        {selectedValue || placeholder}
        <Icon isExpanded={isExpanded}>
          ▼
        </Icon>
      </DropdownButton>
                                 
      {isExpanded && (
        <DropdownMenu>
          <DropdownBackdrop onClick={toggleExpanded} />
          <DropdownContent>
            {filteredOptions.map((option) => (
              <DropdownItem 
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option);
                }}
              >
                {option}
              </DropdownItem>
            ))}
          </DropdownContent>
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
}

export default DropdownFilter;

const Icon = styled.span<{ isExpanded: boolean }>`
  transform: ${props => props.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s ease;
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button<{ isExpanded: boolean }>`
  width: 160px;
  height: 40px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--color-black);
  background: var(--color-white);
  border: 1px solid #ccc;
  border-radius: ${props => props.isExpanded ? '5px 5px 0 0' : '5px'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
           
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 120px;
  min-height: 120px;
  max-height: 200px;
  flex-shrink: 0;
  border: 1px solid #CCC;
  border-top: none;
  background: var(--color-white);
  z-index: 10;
  overflow: hidden;
  box-sizing: border-box;
`;

const DropdownBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
`;

const DropdownContent = styled.div`
  position: relative;
  z-index: 1;
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
  position: relative;
             
  &:hover {
    background-color: #f5f0fa;
    color: #9966CC;
  }
             
  &:last-child {
    border-bottom: none;
  }
`;
