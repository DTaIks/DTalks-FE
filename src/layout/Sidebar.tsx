import styled from "styled-components";
import { useState } from "react";
import LogoImage from "../assets/common/Small_Logo.png";

export type SidebarProps = {
  className?: string;
};

interface DropdownIconProps {
  isOpen: boolean;
}

const SidebarRoot = styled.div`
  width: 400px;
  min-height: 3067px;
  height: 100vh;
  background-color: var(--color-white);
  font-size: var(--font-size-22);
  color: var(--color-dimgray);
  font-family: var(--font-pretendard);
  box-shadow: 0px 1px 15px rgba(153, 102, 204, 0.1);
  display: flex;
  flex-direction: column;
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 32px 0 24px;
`;

const Logo = styled.img`
  width: 55.6px;
  height: 55px;
  object-fit: cover;
`;

const AdminPageTitle = styled.div`
  margin-left: 24px;
  font-weight: 600;
  font-size: var(--font-size-22);
  color: var(--color-dimgray);
`;

const DividerLine = styled.div`
  border-top: 0.5px solid var(--color-darkgray-200);
  margin: 24px 0 0 0;
`;

const MenuSection = styled.div`
  margin-top: 24px;
`;

const MenuTitle = styled.div`
  font-size: var(--font-size-22);
  font-weight: 600;
  color: var(--color-dimgray);
  padding: 0 32px 8px 32px;
`;

const MenuItem = styled.div<{ isSelected?: boolean; isToggle?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px 12px 48px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
  ${props => props.isSelected && `
    background: rgba(153, 102, 204, 0.15);
  `}
  ${props => !props.isToggle && !props.isSelected && `
    &:hover {
      background-color: rgba(153, 102, 204, 0.08);
    }
  `}
`;

const MenuItemText = styled.div`
  font-size: var(--font-size-20);
  font-weight: 500;
  color: var(--color-dimgray);
  &.stats {
    margin-left: 16px;
  }
`;

const DropdownIcon = styled.span<DropdownIconProps>`
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  font-size: var(--font-size-16);
  color: #666666;
`;

const SubMenuContainer = styled.div<{ isOpen: boolean }>`
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1);
  background: none;
`;

const SubMenuItem = styled.div<{ isSelected?: boolean }>`
  padding: 10px 32px 10px 80px;
  font-size: var(--font-size-20);
  font-weight: 500;
  color: var(--color-dimgray);
  cursor: pointer;
  border-radius: 8px;
  ${props => props.isSelected && `
    background: rgba(153, 102, 204, 0.15);
  `}
  transition: background-color 0.2s ease;
  ${props => !props.isSelected && `
    &:hover {
      background-color: rgba(153, 102, 204, 0.08);
    }
  `}
`;

const ActiveSubMenuItem = styled(SubMenuItem)`
  color: var(--color-mediumpurple-100);
`;

const Sidebar = ({ className = "" }: SidebarProps) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    document: false,
    faq: false,
    userManagement: false
  });

  const [selectedMenu, setSelectedMenu] = useState<string>("");

  const toggleMenu = (menuKey: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleMenuClick = (menuKey: string) => {
    setSelectedMenu(menuKey);
  };

  return (
    <SidebarRoot className={className}>
      <LogoRow>
        <Logo alt="" src={LogoImage} />
        <AdminPageTitle>관리자 페이지</AdminPageTitle>
      </LogoRow>
      <DividerLine />
      <MenuSection>
        <MenuTitle>메인</MenuTitle>
        <MenuItem 
          isSelected={selectedMenu === "stats"}
          onClick={() => handleMenuClick("stats")}
        >
          <MenuItemText className="stats">통계</MenuItemText>
        </MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuTitle>데이터 관리</MenuTitle>
      </MenuSection>
      <MenuSection>
        <MenuItem 
          isToggle={true}
          onClick={() => toggleMenu('userManagement')}
        >
          <MenuItemText>사용자 관리</MenuItemText>
          <DropdownIcon isOpen={openMenus.userManagement}>▼</DropdownIcon>
        </MenuItem>
        <SubMenuContainer isOpen={openMenus.userManagement}>
          <ActiveSubMenuItem 
            isSelected={selectedMenu === "userList"}
            onClick={() => handleMenuClick("userList")}
          >
            사용자 목록
          </ActiveSubMenuItem>
          <SubMenuItem 
            isSelected={selectedMenu === "permission"}
            onClick={() => handleMenuClick("permission")}
          >
            권한 관리
          </SubMenuItem>
        </SubMenuContainer>
      </MenuSection>
      <MenuSection>
        <MenuItem 
          isToggle={true}
          onClick={() => toggleMenu('document')}
        >
          <MenuItemText>사내 문서 관리</MenuItemText>
          <DropdownIcon isOpen={openMenus.document}>▼</DropdownIcon>
        </MenuItem>
        <SubMenuContainer isOpen={openMenus.document}>
          <SubMenuItem 
            isSelected={selectedMenu === "allDocuments"}
            onClick={() => handleMenuClick("allDocuments")}
          >
            전체 문서
          </SubMenuItem>
          <SubMenuItem 
            isSelected={selectedMenu === "terms"}
            onClick={() => handleMenuClick("terms")}
          >
            용어 사전
          </SubMenuItem>
          <SubMenuItem 
            isSelected={selectedMenu === "regulations"}
            onClick={() => handleMenuClick("regulations")}
          >
            사내 규정
          </SubMenuItem>
          <SubMenuItem 
            isSelected={selectedMenu === "manual"}
            onClick={() => handleMenuClick("manual")}
          >
            업무 매뉴얼
          </SubMenuItem>
          <SubMenuItem 
            isSelected={selectedMenu === "reportForm"}
            onClick={() => handleMenuClick("reportForm")}
          >
            보고서 양식
          </SubMenuItem>
        </SubMenuContainer>
      </MenuSection>
      <MenuSection>
        <MenuItem 
          isSelected={selectedMenu === "media"}
          onClick={() => handleMenuClick("media")}
        >
          <MenuItemText>미디어 관리</MenuItemText>
        </MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuItem 
          isToggle={true}
          onClick={() => toggleMenu('faq')}
        >
          <MenuItemText>FAQ 관리</MenuItemText>
          <DropdownIcon isOpen={openMenus.faq}>▼</DropdownIcon>
        </MenuItem>
        <SubMenuContainer isOpen={openMenus.faq}>
          <SubMenuItem 
            isSelected={selectedMenu === "scheduleList"}
            onClick={() => handleMenuClick("scheduleList")}
          >
            일정 목록
          </SubMenuItem>
          <SubMenuItem 
            isSelected={selectedMenu === "scheduleRegister"}
            onClick={() => handleMenuClick("scheduleRegister")}
          >
            일정 등록
          </SubMenuItem>
        </SubMenuContainer>
      </MenuSection>
      <MenuSection>
        <MenuTitle>시스템</MenuTitle>
        <MenuItem 
          isSelected={selectedMenu === "settings"}
          onClick={() => handleMenuClick("settings")}
        >
          <MenuItemText>설정</MenuItemText>
        </MenuItem>
      </MenuSection>
    </SidebarRoot>
  );
};

export default Sidebar;
