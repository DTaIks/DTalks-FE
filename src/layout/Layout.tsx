import Sidebar from './Sidebar';
import styled from 'styled-components';
import { Outlet, useLocation } from 'react-router-dom';
import TitleContainer from './TitleContainer';

export default function Layout() {
  const location = useLocation();
  
  // 페이지별 타이틀 정보
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin':
        return { title: '통계', subtitle: '챗봇 성능과 사용자 데이터를 분석하세요' };
      case '/admin/users':
        return { title: '사용자 목록', subtitle: '등록한 사용자들을 관리하세요' };
      case '/admin/permission':
        return { title: '권한 관리', subtitle: '역할과 권한을 체계적으로 관리하세요' };
      case '/admin/faq':
        return { title: 'FAQ 관리', subtitle: '자주 묻는 질문들을 관리하고 편집하세요' };
      case '/admin/faqcategory':
        return { title: 'FAQ 카테고리 관리', subtitle: 'FAQ 카테고리를 관리하고 편집하세요' };
      case '/admin/settings':
        return { title: '통계', subtitle: '챗봇 성능과 사용자 데이터를 분석하세요' };
      default:
        return { title: '', subtitle: '' };
    }
  };

  const pageInfo = getPageTitle();

  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <ContentArea>
          {pageInfo.title && (
            <TitleContainer title={pageInfo.title} subtitle={pageInfo.subtitle} />
          )}
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`

  margin-left: 316px;
  margin-top: 140px;
  background: var(--color-lightgray-100);
`; 