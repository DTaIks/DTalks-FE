import React from 'react';
import InputField from "@/components/common/InputField";
import Button from "@/components/common/Button";
import styled from "styled-components";

interface LoginFormProps {
  className?: string;
  email: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogin: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  className = "",
  email = "",
  password = "",
  onEmailChange,
  onPasswordChange,
  onLogin,
  isLoading = false,
  error = null
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (onLogin && !isLoading) {
      onLogin();
    }
  };

  return (
    <LoginFormContainer className={className}>
      <BackgroundPanel />
      <TitleWrapper>
        <WelcomeTitle>다시 만나서 반가워요 :)</WelcomeTitle>
      </TitleWrapper>
      <Form onSubmit={handleSubmit}>
        <InputField
          variant="login"
          title="아이디"
          placeholder="이메일을 입력하세요."
          type="email"
          value={email}
          onChange={onEmailChange}
          inputWidth="380px"
          autocomplete="username"
        />
        <InputField
          inputWidth="380px"
          inputAlignSelf="unset"
          title="비밀번호"
          placeholder="비밀번호를 입력하세요."
          type="password"
          value={password}
          onChange={onPasswordChange}
          autocomplete="current-password"
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ForgotPasswordLink href="/signup">
          <span>비밀번호 찾기</span>
        </ForgotPasswordLink>
        <LoginButtonWrapper>
          <Button
            text="로그인"
            type="submit"
            variant="login"
            width="380px"
            height="36px"
            disabled={isLoading}
            isLoading={isLoading}
          />
        </LoginButtonWrapper>
      </Form>
    </LoginFormContainer>
  );
};

export default LoginForm;

const BackgroundPanel = styled.div`
  width: 585px;
  height: 382.5px;
  position: relative;
  border-radius: 18.75px;
  background-color: var(--color-white);
  display: none;
  max-width: 100%;
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin-bottom: 0px;
`;

const WelcomeTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  line-height: 28px;
  font-weight: 700;
  z-index: 1;
  text-align: center;
`;

const LoginButtonWrapper = styled.div`
  width: 382.125px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0px 0.75px;
  box-sizing: border-box;
  max-width: 100%;
`;

const Form = styled.form`
  margin: 0;
  margin-top: 0;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  max-width: 100%;
`;

const LoginFormContainer = styled.div`
  width: 585px;
  height: 382.5px;
  flex-shrink: 0;
  border-radius: 18.75px;
  background: #FFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 45px 40px;
  box-sizing: border-box;
  gap: 38.625px;
  max-width: 100%;
  text-align: center;
  font-size: var(--font-size-32);
  color: var(--color-black);
  font-family: var(--font-pretendard);
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 14px;
  text-align: center;
  align-self: flex-start;
  width: 100%;
`;

const ForgotPasswordLink = styled.a`
  color: var(--color-mediumpurple-300);
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  margin-bottom: 8px;
  width: 382.5px;
  display: block;
  text-align: right;
  pointer-events: none;
  &:hover {
    text-decoration: underline;
    color: #7742A7;
  }
  span {
    pointer-events: auto;
  }
`;