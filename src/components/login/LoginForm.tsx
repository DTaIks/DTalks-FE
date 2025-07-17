import React from 'react';
import styled from "styled-components";
import InputField from "../common/InputField";
import Button from "../common/Button";

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

const BackgroundPanel = styled.div`
  width: 780px;
  height: 510px;
  position: relative;
  border-radius: 25px;
  background-color: var(--color-white);
  display: none;
  max-width: 100%;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0px 108px;
  box-sizing: border-box;
  max-width: 100%;
  @media screen and (max-width: 700px) {
    padding-left: 54px;
    padding-right: 54px;
    box-sizing: border-box;
  }
  @media screen and (max-width: 450px) {
    padding-left: var(--padding-20);
    padding-right: var(--padding-20);
    box-sizing: border-box;
  }
`;

const WelcomeTitle = styled.h1`
  margin: 0;
  position: relative;
  font-size: inherit;
  line-height: 28px;
  font-weight: 700;
  font-family: inherit;
  z-index: 1;
  @media screen and (max-width: 950px) {
    font-size: var(--font-size-26);
    line-height: 22px;
  }
  @media screen and (max-width: 450px) {
    font-size: var(--font-size-19);
    line-height: 17px;
  }
`;

const LoginButtonWrapper = styled.div`
  width: 509.5px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0px var(--padding-1);
  box-sizing: border-box;
  max-width: 100%;
`;

const Form = styled.form`
  margin: 0;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 18.5px;
  max-width: 100%;
`;

const LoginFormContainer = styled.div`
  position: absolute;
  top: 351px;
  left: calc(50% - 385px);
  border-radius: 25px;
  background-color: var(--color-white);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  padding: var(--padding-60) 140px 51.5px 118px;
  box-sizing: border-box;
  gap: 51.5px;
  width: 780px;
  height: 510px;
  max-width: 100%;
  text-align: center;
  font-size: var(--font-size-32);
  color: var(--color-black);
  font-family: var(--font-pretendard);
  @media screen and (max-width: 950px) {
    padding-left: 59px;
    padding-right: 70px;
    box-sizing: border-box;
  }
  @media screen and (max-width: 700px) {
    padding-top: 39px;
    padding-bottom: 33px;
    box-sizing: border-box;
  }
  @media screen and (max-width: 450px) {
    gap: var(--gap-26);
    padding-left: var(--padding-20);
    padding-right: var(--padding-20);
    box-sizing: border-box;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 16px;
  margin-top: 8px;
  text-align: center;
`;

const ForgotPasswordLink = styled.a`
  color: var(--color-mediumpurple-300);
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  margin-bottom: 8px;
  align-self: flex-end;
  
  &:hover {
    text-decoration: underline;
    color: #7742A7;
  }
`;

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
        />
        <InputField
          inputWidth="510px"
          inputAlignSelf="unset"
          title="비밀번호"
          placeholder="비밀번호를 입력하세요."
          type="password"
          value={password}
          onChange={onPasswordChange}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ForgotPasswordLink href="/forgot-password">
          비밀번호 찾기
        </ForgotPasswordLink>
        <LoginButtonWrapper>
          <Button
            text="로그인"
            type="submit"
            variant="login"
            disabled={isLoading}
            isLoading={isLoading}
          />
        </LoginButtonWrapper>
      </Form>
    </LoginFormContainer>
  );
};

export default LoginForm;