import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LoginForm from "../../components/login/LoginForm";
import Logo from "../../assets/common/Logo.png";
import { useAuthStore } from '../../store/authStore';
import styled from "styled-components";

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

// 더미 사용자 데이터
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: '123456',
    name: '테스트 사용자',
    employeeNumber: 'EMP001'
  },
  {
    id: '2', 
    email: 'admin@dtalks.com',
    password: 'admin123',
    name: '관리자',
    employeeNumber: 'EMP002'
  },
  {
    id: '3',
    email: 'user@dtalks.com', 
    password: 'user123',
    name: '일반 사용자',
    employeeNumber: 'EMP003'
  }
];

export default function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // React Hook Form 설정
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange' // 실시간 유효성 검사
  });

  // Zustand store에서 상태 가져오기
  const { isAuthenticated, error, setUser, setAuthenticated, setLoading, setError } = useAuthStore();

  // 이미 로그인된 경우 어드민 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // 로그인 함수
  const handleLogin = async (data: LoginFormData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 1초 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 더미 데이터에서 사용자 찾기
      const user = mockUsers.find(u => 
        u.email === data.email && u.password === data.password
      );
      
      if (!user) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      
      // 로그인 성공
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        employeeNumber: user.employeeNumber
      });
      setAuthenticated(true);
      setLoading(false);
      setError(null);
      
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : '로그인에 실패했습니다.');
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
    <div className="page-scale">
      <LoginPageContainer>
        <LogoImage alt="로고" src={Logo} onClick={() => navigate('/')} />
        <LoginForm 
          email={email}
          password={password}
          onEmailChange={(e) => setValue('email', e.target.value)}
          onPasswordChange={(e) => setValue('password', e.target.value)}
          onLogin={handleSubmit(handleLogin)}
          isLoading={isLoading}
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

// styled-components 정의부 (파일 하단)
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