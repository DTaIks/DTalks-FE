import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoginForm from "@/components/login/LoginForm";
import Logo from "@/assets/common/Logo.png";
import { useAuthStore } from '@/store/authStore';
import { useLoginStore } from '@/store/loginStore';
import { useLogin } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/utils/authSchema';
import styled from "styled-components";

export default function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  
  // Zustand store에서 상태 가져오기
  const { isAuthenticated } = useAuthStore();
  const { 
    email: savedEmail, 
    password: savedPassword, 
    error, 
    isLoading,
    setEmail, 
    setPassword, 
    setError, 
    setLoading,
    resetForm 
  } = useLoginStore();

  // React Hook Form 설정 - 저장된 값으로 초기화
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError: setFormError
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange', // 실시간 유효성 검사
    defaultValues: {
      email: savedEmail,
      password: savedPassword
    }
  });

  // 로그인 뮤테이션 훅 사용
  const loginMutation = useLogin();

  // 이미 로그인된 경우 어드민 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // 로그인 함수
  const handleLogin = async (data: LoginFormData): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      setFormError('email', { message: '' });
      setFormError('password', { message: '' });
      
      // 로그인 뮤테이션 실행
      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password
      });
      
      // 성공 시 폼 초기화하고 어드민 페이지로 이동
      resetForm();
      navigate('/admin');
    } catch (error: unknown) {
      console.error('로그인 실패:', error);
      // 에러는 useLogin 훅에서 이미 처리됨
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = (): void => {
    navigate('/signup');
  };

  // 현재 입력값들
  const email = watch('email') || '';
  const password = watch('password') || '';

  return (
    <div>
      <LoginPageContainer>
        <LogoImage alt="로고" src={Logo} onClick={() => navigate('/')} />
        <LoginForm 
          email={email}
          password={password}
          onEmailChange={(e) => {
            const value = e.target.value;
            setValue('email', value);
            setEmail(value);
            setError(null);
          }}
          onPasswordChange={(e) => {
            const value = e.target.value;
            setValue('password', value);
            setPassword(value);
            setError(null);
          }}
          onLogin={handleSubmit(handleLogin)}
          isLoading={isLoading || loginMutation.isPending}
          error={error || errors.email?.message || errors.password?.message}
        />
        <SignUpContainer>
          <SignUpText>{`처음이신가요? `}</SignUpText>
          <SignUpText>
            <SignUpLink onClick={handleSignUpClick}>회원가입</SignUpLink> 하러 가기
          </SignUpText>
        </SignUpContainer>
      </LoginPageContainer>
    </div>
  );
}

const LogoImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-bottom: 32px;
  &:hover {
    transform: scale(1.05);
  }
`;

const SignUpText = styled.span`
  font-size: var(--font-size-16);
`;

const SignUpLink = styled.span`
  text-decoration: underline;
  cursor: pointer;
  font-size: var(--font-size-16);
  &:hover {
    color: var(--color-mediumpurple-300);
  }
`;

const SignUpContainer = styled.div`
  margin-top: 32px;
  line-height: 24px;
  display: inline-block;
  width: 390px;
  font-size: var(--font-size-16);
`;

const LoginPageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: var(--color-ghostwhite);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  text-align: center;
  font-size: var(--font-size-16);
  color: var(--color-black);
  font-family: var(--font-pretendard);
`; 