import React from 'react';
import styled from 'styled-components';

// 버튼 props 인터페이스
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

// 버튼 상태 인터페이스
interface ButtonState {
  isLoading: boolean;
}

class Button extends React.Component<ButtonProps, ButtonState> {
  constructor(props: ButtonProps) {
    super(props);
    this.state = {
      isLoading: props.isLoading || false
    };
  }

  // props 변경 시 상태 업데이트
  componentDidUpdate(prevProps: ButtonProps) {
    if (prevProps.isLoading !== this.props.isLoading) {
      this.setState({ isLoading: this.props.isLoading || false });
    }
  }

  // 클릭 핸들러
  handleClick = () => {
    if (this.props.onClick && !this.props.disabled && !this.state.isLoading) {
      this.props.onClick();
    }
  };

  render() {
    const {
      text,
      variant = 'primary',
      type = 'button',
      width,
      height,
      fontSize,
      disabled = false,
      isCompleted = false,
      style,
      className
    } = this.props;

    const displayText = this.state.isLoading ? '로딩 중...' : text;

    // DOM에 전달되지 않을 props 분리
    const buttonProps = {
      type,
      onClick: this.handleClick,
      disabled: disabled || this.state.isLoading,
      style,
      className
    };

    // 로그인 버튼 렌더링
    if (variant === 'login') {
      return (
        <StyledButton
          {...buttonProps}
          $variant={variant}
          $width={width}
          $height={height}
          $fontSize={fontSize}
          $isCompleted={isCompleted}
        >
          <ButtonInner>
            <ButtonText>
              {displayText}
            </ButtonText>
          </ButtonInner>
        </StyledButton>
      );
    }

    // 일반 버튼 렌더링
    return (
      <StyledButton
        {...buttonProps}
        $variant={variant}
        $width={width}
        $height={height}
        $fontSize={fontSize}
        $isCompleted={isCompleted}
      >
        {displayText}
      </StyledButton>
    );
  }
}

export default Button;

const ButtonText = styled.div`
  position: relative;
  font-size: var(--font-size-18);
  line-height: normal;
  font-weight: var(--table-header-font-weight);
  font-family: var(--font-pretendard);
  font-style: normal;
  color: var(--color-white);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

// 버튼 내부 컨테이너
const ButtonInner = styled.div`
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

// 메인 버튼 스타일
const StyledButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'submit' | 'login';
  $width?: string;
  $height?: string;
  $fontSize?: string;
  disabled?: boolean;
  $isCompleted?: boolean;
}>`
  display: flex;
  width: ${props => props.$width || 'var(--button-default-width)'};
  height: ${props => props.$height || 'var(--button-default-height)'};
  padding: ${props => {
    switch (props.$variant) {
      case 'submit': return 'var(--padding-9)';
      case 'login': return 'var(--padding-login)';
      default: return 'var(--padding-6) var(--padding-12)';
    }
  }};
  flex-direction: ${props => props.$variant === 'login' ? 'row' : 'column'};
  justify-content: ${props => props.$variant === 'login' ? 'flex-start' : 'center'};
  align-items: ${props => props.$variant === 'login' ? 'flex-start' : 'center'};
  flex-shrink: 0;
  border-radius: ${props => {
    switch (props.$variant) {
      case 'submit':
      case 'login': return 'var(--br-6)';
      default: return 'var(--br-5)';
    }
  }};
  background-color: ${props => {
    if (props.disabled) return 'var(--color-disabled)';
    switch (props.$variant) {
      case 'submit': return 'var(--color-mediumpurple-300)';
      case 'login': return 'transparent';
      case 'secondary': return 'var(--color-lightgray)';
      default: return props.$isCompleted ? 'var(--color-mediumpurple-300)' : 'var(--color-mediumpurple-400)';
    }
  }};
  border: ${props => props.$variant === 'secondary' ? '1px solid var(--color-divider)' : 'none'};
  color: ${props => props.$variant === 'secondary' ? 'var(--color-dimgray)' : 'var(--color-white)'};
  font-weight: var(--table-header-font-weight);
  font-size: ${props => props.$fontSize || 'var(--font-size-default)'};
  font-family: var(--font-pretendard);
  font-style: normal;
  line-height: normal;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  white-space: nowrap;
  margin: ${props => props.$variant === 'submit' ? '0 auto' : '0'};
  overflow: ${props => props.$variant === 'login' ? 'hidden' : 'visible'};
  box-sizing: border-box;
  max-width: 100%;
  z-index: ${props => props.$variant === 'login' ? '1' : 'auto'};
  
  &:hover:not(:disabled) {
    ${props => props.$variant === 'login' ? `
      ${ButtonInner} {
        background-color: var(--color-hover);
      }
    ` : `
      background-color: ${props.$variant === 'submit' ? 'var(--color-hover)' : props.$variant === 'secondary' ? 'var(--color-hover-secondary)' : 'var(--color-hover)'};
    `}
  }
  
  &:disabled {
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    ${props => props.$variant === 'login' ? `
      ${ButtonInner} {
        background-color: var(--color-active);
      }
    ` : `
      background-color: ${props.$variant === 'submit' ? 'var(--color-active)' : props.$variant === 'secondary' ? 'var(--color-active-secondary)' : 'var(--color-active)'};
    `}
  }
`; 