import React, { useEffect } from 'react';
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LoginForm from "../../components/login/LoginForm";
import Logo from "../../assets/common/Logo.png";
import { useAuthStore } from '../../store/authStore';
import { useLogin } from '../../hooks/useAuth';

// 유효성 검사 스키마
const loginSchema = yup.object({
  email: yup
    .string()
    .required('이메일을 입력해 주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
  password: yup
    .string()
    .required('비밀번호를 입력해 주세요.')
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
}).required();

type LoginFormData = yup.InferType<typeof loginSchema>;

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

const DemoAccountsContainer = styled.div`
  position: absolute;
  top: 750px;
  left: calc(50% - 200px);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
  color: #666;
  text-align: left;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const DemoAccount = styled.div`
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DemoTitle = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
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
  const navigate = useNavigate();
  
  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange' // 실시간 유효성 검사
  });

  // Zustand store에서 상태 가져오기
  const { isAuthenticated, error, clearError } = useAuthStore();
  
  // React Query mutation
  const loginMutation = useLogin();

  // 이미 로그인된 경우 홈페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 폼 제출 핸들러
  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      await loginMutation.mutateAsync({ 
        email: data.email, 
        password: data.password 
      });
      // 로그인 성공 시 리다이렉트는 useEffect에서 처리
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  const handleSignUpClick = (): void => {
    navigate('/signup');
  };

  // 현재 입력값들
  const email = watch('email') || '';
  const password = watch('password') || '';

  return (
    <LoginPageContainer>
      <LogoImage alt="로고" src={Logo} onClick={() => navigate('/')} />
      <LoginForm 
        email={email}
        password={password}
        onEmailChange={(e) => setValue('email', e.target.value)}
        onPasswordChange={(e) => setValue('password', e.target.value)}
        onLogin={handleSubmit(onSubmit)}
        isLoading={loginMutation.isPending}
        error={error || errors.email?.message || errors.password?.message}
      />
      <DemoAccountsContainer>
        <DemoTitle>🧪 데모 계정</DemoTitle>
        <DemoAccount>
          <strong>테스트 사용자:</strong> test@example.com / 123456
        </DemoAccount>
        <DemoAccount>
          <strong>관리자:</strong> admin@dtalks.com / admin123
        </DemoAccount>
        <DemoAccount>
          <strong>일반 사용자:</strong> user@dtalks.com / user123
        </DemoAccount>
      </DemoAccountsContainer>
      
      <SignUpContainer>
        <SignUpText>{`처음이신가요? `}</SignUpText>
        <SignUpText>
          <SignUpLink onClick={handleSignUpClick}>회원가입</SignUpLink> 하러 가기
        </SignUpText>
      </SignUpContainer>
    </LoginPageContainer>
  );
} 