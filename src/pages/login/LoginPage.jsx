import React, { useState } from 'react';
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import LoginForm from "../../components/login/LoginForm";
import Logo from "../../assets/common/Logo.png";

const LogoImage = styled.img`
  position: absolute;
  top: 152px;
  left: calc(50% - 67px);
  width: 135px;
  height: 134px;
  object-fit: cover;
`;
const SignUpText = styled.span``;
const SignUpLink = styled.span`
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: var(--color-mediumpurple-300);
  }
`;
const SignUpContainer = styled.div`
  position: absolute;
  top: 888px;
  left: calc(50% - 260px);
  line-height: 24px;
  display: inline-block;
  width: 520px;
`;
const LoginPageContainer = styled.div`
  width: 100%;
  position: relative;
  background-color: var(--color-ghostwhite);
  height: 1080px;
  overflow: hidden;
  text-align: center;
  font-size: var(--font-size-22);
  color: var(--color-black);
  font-family: var(--font-pretendard);
`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    console.log('로그인 시도:', { email, password });
    // 여기에 로그인 로직을 추가할 수 있습니다
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <LoginPageContainer>
      <LogoImage alt="로고" src={Logo} />
      <LoginForm 
        email={email}
        password={password}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onLogin={handleLogin}
      />
      <SignUpContainer>
        <SignUpText>{`처음이신가요? `}</SignUpText>
        <SignUpText>
          <SignUpLink onClick={handleSignUpClick}>회원가입</SignUpLink> 하러 가기
        </SignUpText>
      </SignUpContainer>
    </LoginPageContainer>
  );
}
