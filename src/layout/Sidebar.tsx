import styled from "styled-components";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

// 메뉴 및 드롭다운 상수
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

// 메뉴 데이터 타입 명확화
interface MenuDataItem {
  key: string;
  text: string;
  className?: string;
  isDropdown?: boolean;
  subItems?: MenuDataItem[];
}

interface MenuSectionData {
  title: string;
  items: MenuDataItem[];
}

// 메뉴 데이터 정의
const menuData: MenuSectionData[] = [
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
          { key: MENU_ITEMS.USER_LIST, text: "사용자 목록" },
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

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    [DROPDOWN_MENUS.DOCUMENT]: false,
    [DROPDOWN_MENUS.FAQ]: false,
    [DROPDOWN_MENUS.USER_MANAGEMENT]: false
  });
  const [hoveredMenu, setHoveredMenu] = useState<string>("");
  const [hoveredSubMenu, setHoveredSubMenu] = useState<string>("");

  // 현재 경로에 따라 선택된 메뉴 키 반환
  const getSelectedMenuKey = () => {
    if (location.pathname === "/admin") return MENU_ITEMS.STATS;
    if (location.pathname.startsWith("/admin/users")) return MENU_ITEMS.USER_LIST;
    if (location.pathname.startsWith("/admin/permission")) return MENU_ITEMS.PERMISSION;
    if (location.pathname.startsWith("/admin/settings")) return MENU_ITEMS.SETTINGS;
    // 필요시 추가
    return "";
  };
  const selectedMenu = getSelectedMenuKey();

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

  // 메뉴 렌더링 함수 (중복 제거)
  const renderMenuItem = (item: MenuDataItem) => {
    if (item.isDropdown && item.subItems) {
      return (
        <div key={item.key}>
          <MenuItem
            isToggle={true}
            onClick={() => toggleMenu(item.key)}
            onMouseEnter={() => setHoveredMenu(item.key)}
            onMouseLeave={() => setHoveredMenu("")}
          >
            <MenuItemText>{item.text}</MenuItemText>
            <DropdownIcon isOpen={openMenus[item.key]}>▼</DropdownIcon>
          </MenuItem>
          <SubMenuContainer isOpen={openMenus[item.key]}>
            {item.subItems.map((subItem) => renderSubMenuItem(subItem))}
          </SubMenuContainer>
        </div>
      );
    }
    // 리프 메뉴
    return (
      <MenuItem
        key={item.key}
        isSelected={selectedMenu === item.key}
        onClick={() => handleMenuClick(item.key)}
        onMouseEnter={() => setHoveredMenu(item.key)}
        onMouseLeave={() => setHoveredMenu("")}
      >
        {selectedMenu === item.key
          ? <SelectedMenuItemBackground color="rgba(153, 102, 204, 0.15)" />
          : hoveredMenu === item.key
            ? <SelectedMenuItemBackground color="rgba(153, 102, 204, 0.08)" />
            : null}
        <MenuItemText className={item.className}>{item.text}</MenuItemText>
      </MenuItem>
    );
  };

  // 서브 메뉴 렌더링 함수
  const renderSubMenuItem = (subItem: MenuDataItem) => (
    <SubMenuItem
      key={subItem.key}
      isSelected={selectedMenu === subItem.key}
      onClick={() => handleMenuClick(subItem.key)}
      onMouseEnter={() => setHoveredSubMenu(subItem.key)}
      onMouseLeave={() => setHoveredSubMenu("")}
    >
      {selectedMenu === subItem.key
        ? <SelectedSubMenuItemBackground color="rgba(153, 102, 204, 0.15)" />
        : hoveredSubMenu === subItem.key
          ? <SelectedSubMenuItemBackground color="rgba(153, 102, 204, 0.08)" />
          : null}
      {subItem.text}
    </SubMenuItem>
  );

  return (
    <SidebarRoot className={className}>
      <LogoRow>
        <Logo alt="" src={LogoImage} onClick={handleLogoClick} />
        <AdminPageTitle>관리자 페이지</AdminPageTitle>
      </LogoRow>
      <DividerLine />
      {menuData.map((section, index) => (
        <MenuSection key={index} isSecond={index === 1 || index === 6}>
          {section.title && <MenuTitle>{section.title}</MenuTitle>}
          {section.items.map((item) =>
            item.isDropdown ? (
              <DropdownMenuWrapper key={item.key}>
                {renderMenuItem(item)}
              </DropdownMenuWrapper>
            ) : (
              renderMenuItem(item)
            )
          )}
        </MenuSection>
      ))}
    </SidebarRoot>
  );
};

export default Sidebar;

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
  &:hover { opacity: 0.8; }
`;

const AdminPageTitle = styled.div`
  margin-left: 24px;
  font-weight: 600;
  font-size: var(--font-size-22);
  color: var(--color-dimgray);
`;

const DividerLine = styled.div`
  border-top: 0.5px solid var(--color-darkgray-200);
  margin: 32px 0 0 0;
`;

const MenuSection = styled.div<{ isSecond?: boolean }>`
  margin-top: ${({ isSecond }) => (isSecond ? '40px' : '24px')};
`;

const MenuTitle = styled.div`
  font-size: var(--font-size-22);
  font-weight: 600;
  color: var(--color-dimgray);
  padding: 0 32px 12px 32px;
  margin-top: 0px;
`;

const MenuItem = styled.div<MenuItemProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px 12px 60px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
`;

const SelectedMenuItemBackground = styled.div<{ color?: string }>`
  background: ${({ color }) => color || 'rgba(153, 102, 204, 0.15)'};
  margin: 0 20px;
  border-radius: 8px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
`;

const MenuItemText = styled.div`
  font-size: var(--font-size-20);
  font-weight: 500;
  color: var(--color-dimgray);
  margin-top: 0px;
  position: relative;
  z-index: 1;
`;

const DropdownIcon = styled.span<DropdownIconProps>`
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  font-size: var(--font-size-16);
  color: #666666;
  margin-top: 0px;
  position: relative;
  z-index: 1;
`;

const SubMenuContainer = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: none;
`;

const DropdownMenuWrapper = styled.div`
  & + & { margin-top: 0px; }
`;

const SubMenuItem = styled.div<SubMenuItemProps>`
  padding: 12px 32px 12px 92px;
  font-size: var(--font-size-20);
  font-weight: 500;
  color: var(--color-dimgray);
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  position: relative;
  overflow: hidden;
  & + & { margin-top: 0px; }
`;

const SelectedSubMenuItemBackground = styled.div<{ color?: string }>`
  background: ${({ color }) => color || 'rgba(153, 102, 204, 0.15)'};
  margin: 0 20px;
  border-radius: 8px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
`;
