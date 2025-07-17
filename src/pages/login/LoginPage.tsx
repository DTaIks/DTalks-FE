import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import LoginForm from "../../components/login/LoginForm";
import Logo from "../../assets/common/Logo.png";
import { useAuthStore } from '../../store/authStore';
import { useLogin } from '../../hooks/useAuth';

const LogoImage = styled.img`
  position: absolute;
  top: 152px;
  left: calc(50% - 67px);
  width: 135px;
  height: 134px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
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

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  
  // Zustand store에서 상태 가져오기
  const { isAuthenticated, error, clearError } = useAuthStore();
  
  // React Query mutation
  const loginMutation = useLogin();

  // 이미 로그인된 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // 또는 메인 페이지 경로
    }
  }, [isAuthenticated, navigate]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    // 에러가 있으면 입력 시 초기화
    if (error) {
      clearError();
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    // 에러가 있으면 입력 시 초기화
    if (error) {
      clearError();
    }
  };

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      // 로그인 성공 시 리다이렉트는 useEffect에서 처리
    } catch (error) {
      // 에러는 React Query에서 처리됨
      console.error('로그인 실패:', error);
    }
  };

  const handleSignUpClick = (): void => {
    navigate('/signup');
  };

  return (
    <LoginPageContainer>
      <LogoImage alt="로고" src={Logo} onClick={() => navigate('/')} />
      <LoginForm 
        email={email}
        password={password}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onLogin={handleLogin}
        isLoading={loginMutation.isPending}
        error={error}
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