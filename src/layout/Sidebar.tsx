import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoImage from "@/assets/common/Small_Logo.png";
import ProfileImageSrc from "@/assets/common/Profile.png";
import LogoutModal from "@/components/common/LogoutModal";

type SidebarProps = {
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

interface ProfileMenuAction {
  key: string;
  label: string;
  icon: string;
  hasArrow?: boolean;
}

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
  SCHEDULE_REGISTER: "scheduleRegister"
} as const;

const DROPDOWN_MENUS = {
  USER_MANAGEMENT: "userManagement",
  DOCUMENT: "document",
  FAQ: "faq"
} as const;

const PROFILE_MENU_ACTIONS: ProfileMenuAction[] = [
  { key: 'settings', label: '설정', icon: '' },
  { key: 'logout', label: '로그아웃', icon: '' }
];

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
          { key: MENU_ITEMS.REGULATIONS, text: "사내 정책" },
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
          { key: MENU_ITEMS.SCHEDULE_LIST, text: "FAQ 목록" },
          { key: MENU_ITEMS.SCHEDULE_REGISTER, text: "FAQ 카테고리" }
        ]
      }
    ]
  }
];

const NAVIGATION_MAP: Record<string, string> = {
  [MENU_ITEMS.STATS]: "/admin",
  [MENU_ITEMS.USER_LIST]: "/admin/users",
  [MENU_ITEMS.PERMISSION]: "/admin/permission",
  [MENU_ITEMS.ALL_DOCUMENTS]: "/admin/documents",
  [MENU_ITEMS.TERMS]: "/admin/glossary",
  [MENU_ITEMS.REGULATIONS]: "/admin/policy",
  [MENU_ITEMS.REPORT_FORM]: "/admin/report-form",
  [MENU_ITEMS.MEDIA]: "/admin/media",
  [MENU_ITEMS.SCHEDULE_LIST]: "/admin/faq",
  [MENU_ITEMS.SCHEDULE_REGISTER]: "/admin/faqcategory"
};

const ProfileDropdown: React.FC<{
  isOpen: boolean;
  onMenuClick: (action: string) => void;
}> = ({ isOpen, onMenuClick }) => {
  if (!isOpen) return null;

  return (
    <ProfileDropdownContainer>
      {PROFILE_MENU_ACTIONS.map((action) => (
        <ProfileDropdownItem key={action.key} onClick={() => onMenuClick(action.key)}>
          {action.icon && <ProfileDropdownIcon>{action.icon}</ProfileDropdownIcon>}
          <ProfileDropdownText>{action.label}</ProfileDropdownText>
          {action.hasArrow && <ProfileDropdownArrow>›</ProfileDropdownArrow>}
        </ProfileDropdownItem>
      ))}
    </ProfileDropdownContainer>
  );
};

const MenuItemComponent: React.FC<{
  item: MenuDataItem;
  isSelected: boolean;
  onMenuClick: (key: string) => void;
  onToggle: (key: string) => void;
  isOpen: boolean;
  hoveredMenu: string;
  onHover: (key: string) => void;
  onLeave: () => void;
  getSelectedMenuKey: () => string;
}> = ({ item, isSelected, onMenuClick, onToggle, isOpen, hoveredMenu, onHover, onLeave, getSelectedMenuKey }) => {
  if (item.isDropdown && item.subItems) {
    return (
      <div>
        <MenuItem
          isToggle={true}
          onClick={() => onToggle(item.key)}
          onMouseEnter={() => onHover(item.key)}
          onMouseLeave={onLeave}
        >
          <MenuItemText>{item.text}</MenuItemText>
          <DropdownIcon isOpen={isOpen}>▼</DropdownIcon>
        </MenuItem>
        <SubMenuContainer isOpen={isOpen}>
          {item.subItems.map((subItem) => {
            const isSubItemSelected = getSelectedMenuKey() === subItem.key;
            return (
              <SubMenuItem
                key={subItem.key}
                isSelected={isSubItemSelected}
                onClick={() => onMenuClick(subItem.key)}
                onMouseEnter={() => onHover(subItem.key)}
                onMouseLeave={onLeave}
              >
                {isSubItemSelected
                  ? <SelectedSubMenuItemBackground color="rgba(153, 102, 204, 0.15)" />
                  : hoveredMenu === subItem.key
                    ? <SelectedSubMenuItemBackground color="rgba(153, 102, 204, 0.08)" />
                    : null}
                {subItem.text}
              </SubMenuItem>
            );
          })}
        </SubMenuContainer>
      </div>
    );
  }

  return (
    <MenuItem
      isSelected={isSelected}
      onClick={() => onMenuClick(item.key)}
      onMouseEnter={() => onHover(item.key)}
      onMouseLeave={onLeave}
    >
      {isSelected
        ? <SelectedMenuItemBackground color="rgba(153, 102, 204, 0.15)" />
        : hoveredMenu === item.key
          ? <SelectedMenuItemBackground color="rgba(153, 102, 204, 0.08)" />
          : null}
      <MenuItemText className={item.className}>{item.text}</MenuItemText>
    </MenuItem>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Zustand 스토어 사용
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [hoveredMenu, setHoveredMenu] = useState<string>("");
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const clearHoveredMenu = () => {
    setHoveredMenu("");
  };

  const getSelectedMenuKey = (): string => {
    const pathname = location.pathname;
    
    const sortedEntries = Object.entries(NAVIGATION_MAP).sort((a, b) => {
      const aPath = a[1];
      const bPath = b[1];
      return bPath.length - aPath.length;
    });
    
    for (const [menuKey, path] of sortedEntries) {
      if (pathname === path || pathname.startsWith(path + '/')) {
        return menuKey;
      }
    }
    
    return "";
  };

  // 경로 변경 감지 및 전역 상태 업데이트
  useEffect(() => {
    // setCurrentPath(location.pathname); // This line was removed from imports, so it's removed here.
  }, [location.pathname]);

  const getOpenMenus = (): Record<string, boolean> => {
    const selectedMenu = getSelectedMenuKey();
    const openMenusState = { ...openMenus };
    
    for (const section of menuData) {
      for (const item of section.items) {
        if (item.isDropdown && item.subItems) {
          const hasSelectedSubItem = item.subItems.some(subItem => subItem.key === selectedMenu);
          if (hasSelectedSubItem) {
            openMenusState[item.key] = true;
          }
        }
      }
    }
    
    return openMenusState;
  };

  const handleLogoClick = () => {
    try {
      navigate("/");
    } catch (error) {
      // setGlobalError('네비게이션 오류가 발생했습니다.'); // This line was removed from imports, so it's removed here.
      console.error('Navigation error:', error);
    }
  };

  const handleMenuToggle = (menuKey: string) => {
    try {
      const newOpenMenus = {
        ...openMenus,
        [menuKey]: !openMenus[menuKey]
      };
      setOpenMenus(newOpenMenus);
    } catch (error) {
      // setGlobalError('Menu toggle error:', error); // This line was removed from imports, so it's removed here.
      console.error('Menu toggle error:', error);
    }
  };

  const handleMenuClick = (menuKey: string) => {
    try {
      const targetPath = NAVIGATION_MAP[menuKey];
      if (targetPath) {
        navigate(targetPath);
      }
    } catch (error) {
      // setGlobalError('메뉴 이동 중 오류가 발생했습니다.'); // This line was removed from imports, so it's removed here.
      console.error('Menu navigation error:', error);
    }
  };

  const handleProfileClick = () => {
    try {
      setProfileDropdownOpen(!isProfileDropdownOpen);
    } catch (error) {
      // setGlobalError('Profile dropdown error:', error); // This line was removed from imports, so it's removed here.
      console.error('Profile dropdown error:', error);
    }
  };

  const handleProfileMenuClick = (action: string) => {
    try {
      const actionHandlers: Record<string, () => void> = {
        settings: () => console.log('설정'),
        logout: () => setLogoutModalOpen(true)
      };

      const handler = actionHandlers[action];
      if (handler) {
        handler();
      }
      setProfileDropdownOpen(false);
    } catch (error) {
      // setGlobalError('Profile menu action error:', error); // This line was removed from imports, so it's removed here.
      console.error('Profile menu action error:', error);
    }
  };

  const handleLogoutCancel = () => {
    try {
      setLogoutModalOpen(false);
    } catch (error) {
      // setGlobalError('Logout modal close error:', error); // This line was removed from imports, so it's removed here.
      console.error('Logout modal close error:', error);
    }
  };

  const selectedMenu = getSelectedMenuKey();
  const currentOpenMenus = getOpenMenus();

  return (
    <SidebarRoot className={`sidebar ${className}`}>
      <LogoRow>
        <Logo alt="" src={LogoImage} onClick={handleLogoClick} />
        <AdminPageTitle>관리자 페이지</AdminPageTitle>
      </LogoRow>
      <DividerLine />
      <MenuContent>
        {menuData.map((section, index) => (
          <MenuSection key={index} isSecond={index === 1}>
            {section.title && <MenuTitle>{section.title}</MenuTitle>}
            {section.items.map((item) => (
              <DropdownMenuWrapper key={item.key}>
                <MenuItemComponent
                  item={item}
                  isSelected={selectedMenu === item.key}
                  onMenuClick={handleMenuClick}
                  onToggle={handleMenuToggle}
                  isOpen={currentOpenMenus[item.key] || false}
                  hoveredMenu={hoveredMenu}
                  onHover={setHoveredMenu}
                  onLeave={clearHoveredMenu}
                  getSelectedMenuKey={getSelectedMenuKey}
                />
              </DropdownMenuWrapper>
            ))}
          </MenuSection>
        ))}
      </MenuContent>
      <ProfileDivider />
      <ProfileSection onClick={handleProfileClick}>
        <Profile alt="" src={ProfileImageSrc} />
        <AdminText>admin</AdminText>
        <ProfileDropdown 
          isOpen={isProfileDropdownOpen} 
          onMenuClick={handleProfileMenuClick} 
        />
      </ProfileSection>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
      />
    </SidebarRoot>
  );
};

export default Sidebar;

const SidebarRoot = styled.div`
  width: 248px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: var(--color-white);
  font-size: var(--font-size-14);
  color: var(--color-dimgray);
  font-family: var(--font-pretendard);
  box-shadow: 0px 0.7px 10.5px rgba(153, 102, 204, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;

`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  padding: 16.8px 22.4px 0 16.8px;
`;

const Logo = styled.img`
  width: 38.92px;
  height: 38.5px;
  object-fit: cover;
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:hover { opacity: 0.8; }
`;

const AdminPageTitle = styled.div`
  margin-left: 16.8px;
  font-weight: 600;
  font-size: var(--font-size-16);
  color: var(--color-dimgray);
`;

const DividerLine = styled.div`
  border-top: 0.35px solid var(--color-darkgray-200);
  margin: 22.4px 0 0 0;
`;

const MenuSection = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isSecond'
})<{ isSecond?: boolean }>`
  margin-top: ${({ isSecond }) => (isSecond ? '28px' : '12.6px')};
`;

const MenuTitle = styled.div`
  font-size: var(--font-size-14);
  font-weight: 600;
  color: var(--color-dimgray);
  padding: 0 22.4px 8.4px 22.4px;
  margin-top: 0px;
`;

const MenuItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isToggle' && prop !== 'isSelected'
})<MenuItemProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8.4px 22.4px 8.4px 42px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 5.6px;
  position: relative;
  overflow: hidden;
`;

const SelectedMenuItemBackground = styled.div<{ color?: string }>`
  background: ${({ color }) => color || 'rgba(153, 102, 204, 0.15)'};
  margin: 0 14px;
  border-radius: 5.6px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
`;

const MenuItemText = styled.div`
  font-size: var(--font-size-14);
  font-weight: 500;
  color: var(--color-dimgray);
  margin-top: 0px;
  position: relative;
  z-index: 1;
`;

const DropdownIcon = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen'
})<DropdownIconProps>`
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  font-size: var(--font-size-14);
  color: #666666;
  margin-top: 0px;
  position: relative;
  z-index: 1;
`;

const SubMenuContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen'
})<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => isOpen ? '150px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: none;
`;

const DropdownMenuWrapper = styled.div`
  & + & { margin-top: 0px; }
`;

const SubMenuItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isSelected'
})<SubMenuItemProps>`
  padding: 8.4px 22.4px 8.4px 64.4px;
  font-size: var(--font-size-14);
  font-weight: 500;
  color: var(--color-dimgray);
  cursor: pointer;
  border-radius: 5.6px;
  transition: background-color 0.2s ease;
  position: relative;
  overflow: hidden;
  & + & { margin-top: 0px; }
`;

const SelectedSubMenuItemBackground = styled.div<{ color?: string }>`
  background: ${({ color }) => color || 'rgba(153, 102, 204, 0.15)'};
  margin: 0 14px;
  border-radius: 5.6px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
`;

const MenuContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
`;

const ProfileDivider = styled.div`
  height: 0.35px;
  background-color: #E9E0F0;
  margin: 0;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  padding: 16.8px 22.4px;
  border-top: 0.35px solid var(--color-darkgray-200);
  margin-top: auto;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(153, 102, 204, 0.05);
  }
`;

const Profile = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  margin-right: 12px;
  border-radius: 50%;
`;

const AdminText = styled.div`
  font-size: var(--font-size-18);
  font-weight: 500;
  color: var(--color-dimgray);
  font-family: var(--font-pretendard);
  position: absolute;
  left: 50%;
  transform: translateX(-70%);
`;

const ProfileDropdownContainer = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 8px;
  z-index: 1001;
  overflow: hidden;
`;

const ProfileDropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  
  &:hover {
    background-color: rgba(153, 102, 204, 0.08);
  }
`;

const ProfileDropdownIcon = styled.span`
  font-size: 16px;
  margin-right: 12px;
  width: 20px;
  text-align: center;
`;

const ProfileDropdownText = styled.span`
  font-size: 14px;
  color: var(--color-dimgray);
  font-weight: 500;
  flex: 1;
  padding-left: 8px;
`;

const ProfileDropdownArrow = styled.span`
  font-size: 14px;
  color: var(--color-dimgray);
  margin-left: 8px;
`;