import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Logo from '@/assets/common/Logo.png';
import SignUpForm from '@/components/signup/SignUpForm';
import { useScrollControl } from '@/hooks/useScrollControl';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function SignUpPage(): JSX.Element {
  useScrollToTop();
  
  const navigate = useNavigate();

  // 세로 스크롤만 허용
  useScrollControl(true, { allowVerticalScroll: true });

  return (
    <PageWrapper>
      <LogoImage src={Logo} alt="Logo" onClick={() => navigate('/')} />
      <SignUpForm />
      <BottomText>
        이미 계정이 있으신가요?{' '}
        <BottomLink onClick={() => navigate('/login')}>로그인하기</BottomLink>
      </BottomText>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  background: #F8F2FB;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 20px;
  font-family: 'Pretendard';
  margin-left: 14px;
  margin-top: 78px;
  overflow-x: hidden;
`;

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

const BottomText = styled.p`
  color: #000;
  text-align: center;
  font-size: 16.5px;
  font-weight: 400;
  line-height: 18px;
  margin-top: 20.25px;
`;

const BottomLink = styled.span`
  color: #96C;
  font-size: 16.5px;
  font-weight: 600;
  line-height: 18px;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    opacity: 0.8;
  }
`; 