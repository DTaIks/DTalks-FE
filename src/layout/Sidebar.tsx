import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoImage from "../assets/common/Small_Logo.png";

export type SidebarProps = {
  className?: string;
};

interface DropdownIconProps {
  isOpen: boolean;
}

interface MenuItemProps {
  isSelected?: boolean;
  isToggle?: boolean;
}

interface SubMenuItemProps {
  isSelected?: boolean;
}

// 상수 정의
const MENU_ITEMS = {
  STATS: "stats",
  USER_LIST: "userList",
  PERMISSION: "permission",
  ALL_DOCUMENTS: "allDocuments",
  TERMS: "terms",
  REGULATIONS: "regulations",
  MANUAL: "manual",
  REPORT_FORM: "reportForm",
  MEDIA: "media",
  SCHEDULE_LIST: "scheduleList",
  SCHEDULE_REGISTER: "scheduleRegister",
  SETTINGS: "settings"
} as const;

const DROPDOWN_MENUS = {
  USER_MANAGEMENT: "userManagement",
  DOCUMENT: "document",
  FAQ: "faq"
} as const;

// 스타일 컴포넌트
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
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
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

const MenuItem = styled.div<MenuItemProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px 12px 48px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
  
  ${({ isSelected, isToggle }) => {
    if (isSelected) {
      return 'background: rgba(153, 102, 204, 0.15);';
    }
    if (!isToggle && !isSelected) {
      return `
        &:hover {
          background-color: rgba(153, 102, 204, 0.08);
        }
      `;
    }
    return '';
  }}
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
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  font-size: var(--font-size-16);
  color: #666666;
`;

const SubMenuContainer = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: none;
`;

const SubMenuItem = styled.div<SubMenuItemProps>`
  padding: 10px 32px 10px 80px;
  font-size: var(--font-size-20);
  font-weight: 500;
  color: var(--color-dimgray);
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  
  ${({ isSelected }) => {
    if (isSelected) {
      return 'background: rgba(153, 102, 204, 0.15);';
    }
    return `
      &:hover {
        background-color: rgba(153, 102, 204, 0.08);
      }
    `;
  }}
`;

const ActiveSubMenuItem = styled(SubMenuItem)`
  color: var(--color-mediumpurple-100);
`;

// 메뉴 데이터 정의
const menuData = [
  {
    title: "메인",
    items: [
      { key: MENU_ITEMS.STATS, text: "통계", className: "stats" }
    ]
  },
  {
    title: "데이터 관리",
    items: []
  },
  {
    title: "",
    items: [
      {
        key: DROPDOWN_MENUS.USER_MANAGEMENT,
        text: "사용자 관리",
        isDropdown: true,
        subItems: [
          { key: MENU_ITEMS.USER_LIST, text: "사용자 목록", isActive: true },
          { key: MENU_ITEMS.PERMISSION, text: "권한 관리" }
        ]
      }
    ]
  },
  {
    title: "",
    items: [
      {
        key: DROPDOWN_MENUS.DOCUMENT,
        text: "사내 문서 관리",
        isDropdown: true,
        subItems: [
          { key: MENU_ITEMS.ALL_DOCUMENTS, text: "전체 문서" },
          { key: MENU_ITEMS.TERMS, text: "용어 사전" },
          { key: MENU_ITEMS.REGULATIONS, text: "사내 규정" },
          { key: MENU_ITEMS.REPORT_FORM, text: "보고서 양식" }
        ]
      }
    ]
  },
  {
    title: "",
    items: [
      { key: MENU_ITEMS.MEDIA, text: "미디어 관리" }
    ]
  },
  {
    title: "",
    items: [
      {
        key: DROPDOWN_MENUS.FAQ,
        text: "FAQ 관리",
        isDropdown: true,
        subItems: [
          { key: MENU_ITEMS.SCHEDULE_LIST, text: "일정 목록" },
          { key: MENU_ITEMS.SCHEDULE_REGISTER, text: "일정 등록" }
        ]
      }
    ]
  },
  {
    title: "시스템",
    items: [
      { key: MENU_ITEMS.SETTINGS, text: "설정", className: "stats" }
    ]
  }
];

const Sidebar = ({ className = "" }: SidebarProps) => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    [DROPDOWN_MENUS.DOCUMENT]: false,
    [DROPDOWN_MENUS.FAQ]: false,
    [DROPDOWN_MENUS.USER_MANAGEMENT]: false
  });

  const [selectedMenu, setSelectedMenu] = useState<string>("");

  const handleLogoClick = () => {
    navigate("/");
  };

  const toggleMenu = (menuKey: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleMenuClick = (menuKey: string) => {
    setSelectedMenu(menuKey);
    
    // 메뉴에 따른 네비게이션
    switch (menuKey) {
      case MENU_ITEMS.STATS:
        navigate("/admin");
        break;
      case MENU_ITEMS.USER_LIST:
        navigate("/admin/users");
        break;
      case MENU_ITEMS.PERMISSION:
        navigate("/admin/permission");
        break;
      case MENU_ITEMS.SETTINGS:
        navigate("/admin/settings");
        break;
      default:
        break;
    }
  };

  const renderMenuItem = (item: any) => {
    if (item.isDropdown) {
      return (
        <div key={item.key}>
          <MenuItem 
            isToggle={true}
            onClick={() => toggleMenu(item.key)}
          >
            <MenuItemText>{item.text}</MenuItemText>
            <DropdownIcon isOpen={openMenus[item.key]}>▼</DropdownIcon>
          </MenuItem>
          <SubMenuContainer isOpen={openMenus[item.key]}>
            {item.subItems.map((subItem: any) => {
              const SubMenuItemComponent = subItem.isActive ? ActiveSubMenuItem : SubMenuItem;
              return (
                <SubMenuItemComponent
                  key={subItem.key}
                  isSelected={selectedMenu === subItem.key}
                  onClick={() => handleMenuClick(subItem.key)}
                >
                  {subItem.text}
                </SubMenuItemComponent>
              );
            })}
          </SubMenuContainer>
        </div>
      );
    }

    return (
      <MenuItem 
        key={item.key}
        isSelected={selectedMenu === item.key}
        onClick={() => handleMenuClick(item.key)}
      >
        <MenuItemText className={item.className}>{item.text}</MenuItemText>
      </MenuItem>
    );
  };

  return (
    <SidebarRoot className={className}>
      <LogoRow>
        <Logo alt="" src={LogoImage} onClick={handleLogoClick} />
        <AdminPageTitle>관리자 페이지</AdminPageTitle>
      </LogoRow>
      <DividerLine />
      
      {menuData.map((section, index) => (
        <MenuSection key={index}>
          {section.title && <MenuTitle>{section.title}</MenuTitle>}
          {section.items.map(renderMenuItem)}
        </MenuSection>
      ))}
    </SidebarRoot>
  );
};

export default Sidebar;
