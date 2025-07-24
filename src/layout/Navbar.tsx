import styled from "styled-components";
import { useLocation } from "react-router-dom";
import ProfileImageSrc from "../assets/common/Profile.png";

export type NavbarProps = {
  className?: string;
};

const Navbar = ({ className = "" }: NavbarProps) => {
  const location = useLocation();
  
  const getBreadcrumbText = () => {
    const path = location.pathname;
    
    if (path === "/admin") {
      return "홈  >  통계";
    } else if (path === "/admin/users") {
      return "홈  >  사용자 관리  >  사용자 목록";
    } else if (path === "/admin/permission") {
      return "홈  >  사용자 관리  >  권한 관리";
    } else if (path === "/admin/settings") {
      return "홈  >  시스템  >  설정";
    } else {
      return "홈";
    }
  };

  return (
    <Container className={className}>
      <Background />
      <BreadcrumbText>{getBreadcrumbText()}</BreadcrumbText>
      <RightGroup>
        <Profile alt="" src={ProfileImageSrc} />
        <AdminText>admin</AdminText>
      </RightGroup>
    </Container>
  );
};

export default Navbar;

const Background = styled.div`
  position: absolute;
  top: 0px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0.75px 11.25px 0 rgba(153, 102, 204, 0.10);
  width: 100%;
  height: 75px;
  z-index: 1;
`;

const AdminText = styled.div`
  font-size: var(--font-size-18);
  font-weight: 500;
  color: var(--color-black);
  font-family: var(--font-pretendard);
  z-index: 1000;
  margin-right: 48px;
`;

const Profile = styled.img`
  width: 45px;
  height: 45px;
  object-fit: cover;
  margin-right: 12px;
  z-index: 1000;
`;

const BreadcrumbText = styled.div`
  margin-left: 93px;
  font-size: var(--font-size-15);
  font-weight: 300;
  color: var(--color-dimgray);
  white-space: pre-wrap;
  flex-grow: 1;
  z-index: 1100;
`;

const Container = styled.div`
  position: fixed;
  top: 0px;
  left: 210px;
  right: 0px;
  height: 75px;
  background-color: transparent;
  z-index: 999;
  display: flex;
  align-items: center;
  width: calc(100% - 210px);
`; 

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0;
`; 