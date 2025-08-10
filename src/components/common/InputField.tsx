import React from 'react';
import styled from 'styled-components';

interface InputFieldProps {
  variant?: 'login' | 'signup';
  label?: string;
  title?: string;
  placeholder: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  type?: string;
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
  autocomplete?: string;  
}

// 입력 필드 컴포넌트
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
  autocomplete,
}) => {
  const hasButton = !!buttonText;
  
  if (variant === 'signup') {
    return (
      <SignupInputRow>
        <SignupLabel>{label}</SignupLabel>
        <SignupInputWrapper $hasButton={hasButton}>
          <SignupInput 
            {...inputProps}
            placeholder={placeholder}
            $hasButton={hasButton}
            autoComplete={autocomplete}
            value={inputProps?.value || value}
            onChange={inputProps?.onChange || onChange}
            type={inputProps?.type || type}
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
        {infoText && <SignupInfoText $color={infoTextColor}>{infoText}</SignupInfoText>}
      </SignupInputRow>
    );
  }

  return (
    <LoginInputRoot $inputWidth={inputWidth} $inputAlignSelf={inputAlignSelf} className={className}>
      <LoginTitle>{title}</LoginTitle>
      <LoginTextfield>
        <LoginText 
          type={inputProps?.type || type}
          placeholder={placeholder}
          value={inputProps?.value || value}
          onChange={inputProps?.onChange || onChange}
          autoComplete={autocomplete}
        />
      </LoginTextfield>
    </LoginInputRoot>
  );
};

export default InputField;

// 로그인용 스타일
const LoginInputRoot = styled.div<{ $inputWidth?: string; $inputAlignSelf?: string }>`
  width: 382.5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--gap-12);
  text-align: left;
  font-size: var(--font-size-22);
  color: var(--color-black);
  font-family: var(--font-pretendard);
  width: ${(p) => p.$inputWidth || '382.5px'};
  align-self: ${(p) => p.$inputAlignSelf};
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
  border-radius: 4.5px;
  background-color: var(--color-white);
  border: 0.75px solid var(--color-gray-200);
  box-sizing: border-box;
  height: 34.5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 6px 9px;
  font-size: var(--font-size-20);
  color: var(--color-gray-100);
`;

// 회원가입용 스타일
const SignupInputRow = styled.div`
  margin-bottom: 15px;
  position: relative;
`;

const SignupInputWrapper = styled.div<{ $hasButton: boolean }>`
  display: ${props => props.$hasButton ? 'flex' : 'flex'};
  padding: ${props => props.$hasButton ? '0' : '6px 9px'};
  align-items: center;
  justify-content: center;
  gap: ${props => props.$hasButton ? '6px' : '0'};
  width: 100%;
  box-sizing: border-box;
`;

const SignupLabel = styled.label`
  color: #000;
  font-size: 16.5px;
  font-style: normal;
  font-weight: 500;
  line-height: 15px;
  display: block;
  margin-bottom: 12px;
  text-align: left;
  width: 100%;
  max-width: 540px;
  margin-left: auto;
  margin-right: auto;
  padding-left: calc((100% - 381px) / 2);
`;

const SignupInput = styled.input<{ $hasButton: boolean }>`
  display: flex;
  width: ${props => props.$hasButton ? '250.5px' : '381px'};
  height: 34.5px;
  padding: 6px 9px;
  align-items: center;
  gap: 3px;
  border-radius: 4.5px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  background: #FFF;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
  
  &:focus {
    border-color: #8061B0;
    box-shadow: 0 0 6px #a899f8;
  }
`;

const SignupButton = styled.button`
  width: 124.5px;
  height: 34.5px;
  font-size: 13.5px;
  border-radius: 4.5px;
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

const SignupInfoText = styled.div<{ $color?: string }>`
  font-size: 12px;
  color: ${props => props.$color || '#8c8c8c'};
  margin-top: 3px;
  line-height: 1.2;
  text-align: left;
  width: 100%;
  max-width: 540px;
  margin-left: auto;
  margin-top: 3.75px;
  margin-right: auto;
  padding-left: calc((100% - 381px) / 2 + 9px);
`;
