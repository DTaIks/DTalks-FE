import styled from "styled-components";
import ProfileImageSrc from "../assets/common/Profile.png";

export type NavbarProps = {
  className?: string;
};

const Background = styled.div`
  position: absolute;
  top: 0px;
  background-color: var(--color-white);
  width: calc(100vw - 400px);
  min-width: 1520px;
  height: 100px;
`;

const AdminText = styled.div`
  position: absolute;
  top: 36px;
  right: 64px;
  font-size: var(--font-size-24);
  font-weight: 500;
  color: var(--color-black);
  font-family: var(--font-pretendard);
`;

const Profile = styled.img`
  position: absolute;
  top: 20px;
  right: 159px;
  width: 60px;
  height: 60px;
  object-fit: cover;
`;

const BreadcrumbText = styled.div`
  position: absolute;
  top: 39px;
  left: 58px;
  font-size: var(--font-size-20);
  font-weight: 300;
  color: var(--color-dimgray);
  white-space: pre-wrap;
`;

const Container = styled.div`
  position: absolute;
  top: 0px;
  left: 400px;
  width: 1520px;
  height: 100px;
  background-color: transparent;
  z-index: 999;
`;

const Navbar = ({ className = "" }: NavbarProps) => {
  return (
    <Container className={className}>
      <Background />
      <BreadcrumbText>{`홈  >  사용자 관리  >  사용자 목록 `}</BreadcrumbText>
      <AdminText>admin</AdminText>
      <Profile alt="" src={ProfileImageSrc} />
    </Container>
  );
};

export default Navbar; 