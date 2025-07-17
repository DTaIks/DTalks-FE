import React from 'react';
import styled from 'styled-components';

interface ActionButtonProps {
  text: string;             
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'submit';
  position?: string;
  type?: 'button' | 'submit' | 'reset';
  width?: string;
  height?: string;
  fontSize?: string;
  disabled?: boolean;
  isCompleted?: boolean;
  style?: React.CSSProperties;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  text,             
  onClick,
  variant = 'primary',
  position = 'static',
  type = 'button',
  width,
  height,
  fontSize,
  disabled = false,
  isCompleted = false,
  ...props
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      variant={variant}
      position={position}
      width={width}
      height={height}
      fontSize={fontSize}
      disabled={disabled}
      isCompleted={isCompleted}
      {...props}
    >
      {text}
    </Button>
  );
};

const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'submit';
  position?: string;
  width?: string;
  height?: string;
  fontSize?: string;
  disabled?: boolean;
  isCompleted?: boolean;
}>`
  display: flex;
  width: ${props => {
    if (props.variant === 'submit') return '508px';
    return props.width || '110px';
  }};
  height: ${props => {
    if (props.variant === 'submit') return '46px';
    return props.height || '46px';
  }};
  padding: ${props => props.variant === 'submit' ? '12px' : '8px 16px'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  position: ${props => props.position || 'static'};
  border-radius: ${props => props.variant === 'submit' ? '8px' : '6px'};
  background-color: ${props => {
    if (props.variant === 'submit') {
      return props.disabled ? '#CCC' : '#9966CC';
    }
    if (props.variant === 'secondary') return '#f0f0f0';
    return props.isCompleted ? '#9966CC' : '#8061B0';
  }};
  border: ${props => props.variant === 'secondary' ? '1px solid #d0d0d0' : 'none'};
  color: ${props => props.variant === 'secondary' ? '#333' : 'white'};
  font-weight: 600;
  font-size: ${props => props.fontSize || '12px'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  white-space: nowrap;
  margin: ${props => props.variant === 'submit' ? '0 auto' : '0'};
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    background-color: ${props => {
      if (props.variant === 'submit') return '#7A52CC';
      if (props.variant === 'secondary') return '#e0e0e0';
      return '#7A52CC';
    }};
  }
  
  &:disabled {
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

export default ActionButton; 