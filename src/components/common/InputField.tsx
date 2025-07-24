import React from 'react';
import styled from 'styled-components';

interface InputFieldProps {
  variant?: 'login' | 'signup'; // 로그인용/회원가입용 스타일 구분
  label?: string; // 회원가입용 라벨
  title?: string; // 로그인용 타이틀
  placeholder: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>; // 회원가입용
  type?: string; // 로그인용
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  infoText?: string;
  infoTextColor?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
  className?: string;
  inputWidth?: string;
  inputAlignSelf?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  variant = 'login',
  label,
  title,
  placeholder,
  inputProps,
  type = 'text',
  value,
  onChange,
  infoText,
  infoTextColor,
  buttonText,
  onButtonClick,
  buttonDisabled = false,
  className = '',
  inputWidth,
  inputAlignSelf,
}) => {
  const hasButton = !!buttonText;
  
  if (variant === 'signup') {
    // 회원가입용 스타일
    return (
      <SignupInputRow>
        <SignupLabel>{label}</SignupLabel>
        <SignupInputWrapper hasButton={hasButton}>
          <SignupInput 
            {...inputProps}
            placeholder={placeholder}
            hasButton={hasButton}
          />
          {hasButton && (
            <SignupButton
              type="button"
              onClick={onButtonClick}
              disabled={buttonDisabled}
            >
              {buttonText}
            </SignupButton>
          )}
        </SignupInputWrapper>
        {infoText && <SignupInfoText color={infoTextColor}>{infoText}</SignupInfoText>}
      </SignupInputRow>
    );
  }

  // 로그인용 스타일 (기본)
  return (
    <LoginInputRoot inputWidth={inputWidth} inputAlignSelf={inputAlignSelf} className={className}>
      <LoginTitle>{title}</LoginTitle>
      <LoginTextfield>
        <LoginText 
          type={inputProps?.type || type}
          placeholder={placeholder}
          value={inputProps?.value || value}
          onChange={inputProps?.onChange || onChange}
        />
      </LoginTextfield>
    </LoginInputRoot>
  );
};

// 로그인용 스타일 컴포넌트들
const LoginInputRoot = styled.div<{ inputWidth?: string; inputAlignSelf?: string }>`
  width: 382.5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--gap-12); /* 16 * 0.75 */
  text-align: left;
  font-size: var(--font-size-22);
  color: var(--color-black);
  font-family: var(--font-pretendard);
  width: ${(p) => p.inputWidth || '382.5px'};
  align-self: ${(p) => p.inputAlignSelf};
`;

const LoginTitle = styled.div`
  align-self: stretch;
  position: relative;
  line-height: 20px;
  font-weight: 500;
  font-size: var(--font-size-16);
`;

const LoginText = styled.input`
  flex: 1;
  position: relative;
  line-height: 20px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 20px;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-pretendard);
  font-size: 16px;
  color: var(--color-gray-100);
  width: 100%;
  padding: 0;
`;

const LoginTextfield = styled.div`
  align-self: stretch;
  border-radius: 4.5px; /* 6 * 0.75 */
  background-color: var(--color-white);
  border: 0.75px solid var(--color-gray-200); /* 1 * 0.75 */
  box-sizing: border-box;
  height: 34.5px; /* 46 * 0.75 */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 6px 9px; /* 8, 12 * 0.75 */
  font-size: var(--font-size-20);
  color: var(--color-gray-100);
`;

// 회원가입용 스타일 컴포넌트들
const SignupInputRow = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const SignupInputWrapper = styled.div<{ hasButton: boolean }>`
  display: ${props => props.hasButton ? 'flex' : 'flex'};
  padding: ${props => props.hasButton ? '0' : '8px 12px'};
  align-items: center;
  justify-content: center;
  gap: ${props => props.hasButton ? '8px' : '0'};
  width: 100%;
  box-sizing: border-box;
`;

const SignupLabel = styled.label`
  color: #000;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  display: block;
  margin-bottom: 16px;
  text-align: left;
  width: 100%;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  padding-left: calc((100% - 508px) / 2);
`;

const SignupInput = styled.input<{ hasButton: boolean }>`
  display: flex;
  width: ${props => props.hasButton ? '334px' : '508px'};
  height: 46px;
  padding: 8px 12px;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  background: #FFF;
  font-size: 20px;
  outline: none;
  box-sizing: border-box;
  
  &:focus {
    border-color: #8061B0;
    box-shadow: 0 0 8px #a899f8;
  }
`;

const SignupButton = styled.button`
  width: 166px;
  height: 46px;
  font-size: 18px;
  border-radius: 6px;
  background: #8061B0;
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:enabled {
    background: #9966CC;
  }
  &:disabled {
    background: #CCC;
    cursor: not-allowed;
  }
`;

const SignupInfoText = styled.div<{ color?: string }>`
  font-size: 16px;
  color: ${props => props.color || '#8c8c8c'};
  margin-top: 4px;
  line-height: 1.2;
  text-align: left;
  width: 100%;
  max-width: 720px;
  margin-left: auto;
  margin-top: 5px;
  margin-right: auto;
  padding-left: calc((100% - 508px) / 2 + 12px);
`;

export default InputField; 