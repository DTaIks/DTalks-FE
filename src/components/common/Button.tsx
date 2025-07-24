import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'submit' | 'login';
  type?: 'button' | 'submit' | 'reset';
  width?: string;
  height?: string;
  fontSize?: string;
  disabled?: boolean;
  isLoading?: boolean;
  isCompleted?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = 'primary',
  type = 'button',
  width,
  height,
  fontSize,
  disabled = false,
  isLoading = false,
  isCompleted = false,
  style,
  className
}) => {
  const displayText = isLoading ? '로딩 중...' : text;

  if (variant === 'login') {
    return (
      <StyledButton
        type={type}
        onClick={onClick}
        variant={variant}
        width={width}
        height={height}
        fontSize={fontSize}
        disabled={disabled || isLoading}
        isCompleted={isCompleted}
        style={style}
        className={className}
      >
        <LoginButtonInner>
          <LoginButtonText>
            {displayText}
          </LoginButtonText>
        </LoginButtonInner>
      </StyledButton>
    );
  }

  return (
    <StyledButton
      type={type}
      onClick={onClick}
      variant={variant}
      width={width}
      height={height}
      fontSize={fontSize}
      disabled={disabled || isLoading}
      isCompleted={isCompleted}
      style={style}
      className={className}
    >
      {displayText}
    </StyledButton>
  );
};

export default Button;

const LoginButtonText = styled.div`
  position: relative;
  font-size: 18px;
  line-height: 24px;
  font-weight: 600;
  font-family: var(--font-pretendard);
  color: var(--color-white);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const LoginButtonInner = styled.div`
  flex: 1;
  border-radius: var(--br-8);
  background-color: var(--color-mediumpurple-300);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: var(--padding-12);
  box-sizing: border-box;
  max-width: 100%;
  transition: all 0.2s ease;
  height: 100%;
`;

const StyledButton = styled.button<{
  variant?: 'primary' | 'secondary' | 'submit' | 'login';
  width?: string;
  height?: string;
  fontSize?: string;
  disabled?: boolean;
  isCompleted?: boolean;
}>`
  display: flex;
  width: ${props => {
    if (props.variant === 'submit') return '381px'; /* 508 * 0.75 */
    if (props.variant === 'login') return '382.125px'; /* 509.5 * 0.75 */
    return props.width || '82.5px'; /* 110 * 0.75 */
  }};
  height: ${props => {
    if (props.variant === 'submit') return '34.5px'; /* 46 * 0.75 */
    if (props.variant === 'login') return '34.5px'; /* 46 * 0.75 */
    return props.height || '34.5px';
  }};
  padding: ${props => {
    if (props.variant === 'submit') return '9px'; /* 12 * 0.75 */
    if (props.variant === 'login') return '0.375px 0px 0px'; /* 0.5 * 0.75 */
    return '6px 12px'; /* 8, 16 * 0.75 */
  }};
  flex-direction: ${props => props.variant === 'login' ? 'row' : 'column'};
  justify-content: ${props => props.variant === 'login' ? 'flex-start' : 'center'};
  align-items: ${props => props.variant === 'login' ? 'flex-start' : 'center'};
  flex-shrink: 0;
  border-radius: ${props => {
    if (props.variant === 'submit') return '6px'; /* 8 * 0.75 */
    if (props.variant === 'login') return '6px'; /* var(--br-8) * 0.75 */
    return '4.5px'; /* 6 * 0.75 */
  }};
  background-color: ${props => {
    if (props.variant === 'submit') {
      return props.disabled ? '#CCC' : '#9966CC';
    }
    if (props.variant === 'login') {
      return 'transparent';
    }
    if (props.variant === 'secondary') return '#f0f0f0';
    return props.isCompleted ? '#9966CC' : '#8061B0';
  }};
  border: ${props => props.variant === 'secondary' ? '1px solid #d0d0d0' : 'none'};
  color: ${props => props.variant === 'secondary' ? '#333' : 'white'};
  font-weight: 600;
  font-size: ${props => props.fontSize || (props.variant === 'login' ? 'var(--font-size-22)' : '9px')}; /* 12 * 0.75 */
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: ${props => props.variant === 'login' ? 'transform 0.2s ease' : 'all 0.2s ease'};
  white-space: nowrap;
  margin: ${props => props.variant === 'submit' ? '0 auto' : '0'};
  overflow: ${props => props.variant === 'login' ? 'hidden' : 'visible'};
  box-sizing: border-box;
  max-width: 100%;
  z-index: ${props => props.variant === 'login' ? '1' : 'auto'};
  &:hover:not(:disabled) {
    ${props => props.variant === 'login' ? `
      transform: scale(1.02);
      ${LoginButtonInner} {
        background-color: #7742A7;
        box-shadow: 0 3px 6px rgba(119, 66, 167, 0.3); /* 4, 8 * 0.75 */
        transform: scale(1.02);
      }
    ` : `
      transform: translateY(-2.25px); /* 3 * 0.75 */
      background-color: ${props.variant === 'submit' ? '#7A52CC' : props.variant === 'secondary' ? '#e0e0e0' : '#7A52CC'};
    `}
  }
  &:disabled {
    cursor: not-allowed;
  }
  &:active:not(:disabled) {
    transform: ${props => props.variant === 'login' ? 'scale(0.98)' : 'translateY(0.75px)'}; /* 1 * 0.75 */
  }
`; 