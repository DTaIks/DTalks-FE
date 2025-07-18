import styled from "styled-components";
import LogoImage from "../assets/common/Logo.png";

export type SidebarProps = {
  className?: string;
};

const SidebarBackground = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  box-shadow: 0px 1px 15px rgba(153, 102, 204, 0.1);
  background-color: var(--color-white);
  width: 400px;
  height: 100vh;
  min-height: 3041px;
`;

const DividerLine = styled.div`
  position: absolute;
  top: 100.8px;
  left: -0.2px;
  border-top: 0.5px solid var(--color-darkgray-200);
  box-sizing: border-box;
  width: 400.5px;
  height: 0.5px;
`;

const Logo = styled.img`
  position: absolute;
  top: 23px;
  left: 23px;
  width: 55.6px;
  height: 55px;
  object-fit: cover;
`;

const MainMenu = styled.div`
  position: absolute;
  top: 133px;
  left: 32px;
  font-weight: 600;
`;

const AdminPageTitle = styled.div`
  position: absolute;
  top: 38px;
  left: 104px;
  font-weight: 600;
`;

const DataManagement = styled.div`
  position: absolute;
  top: 351px;
  left: 32px;
  font-weight: 600;
`;

const DropdownIcon = styled.span``;

const DropdownIconText = styled.span`
  font-size: var(--font-size-22);
  color: var(--color-black);
`;

const DropdownArrow = styled.div`
  position: absolute;
  top: 0px;
  left: 273px;
  font-weight: 600;
`;

const DocumentManagement = styled.div`
  position: absolute;
  top: 3px;
  left: 0px;
  font-size: var(--font-size-22);
  font-weight: 600;
`;

const DocumentManagementContainer = styled.div`
  position: absolute;
  top: 581px;
  left: 56px;
  width: 289px;
  height: 29px;
  font-size: var(--font-size-16);
`;

const MediaManagement = styled.div`
  position: absolute;
  top: 910px;
  left: 56px;
  font-weight: 600;
`;

const FAQManagementContainer = styled.div`
  position: absolute;
  top: 1141px;
  left: 56px;
  width: 289px;
  height: 29px;
  font-size: var(--font-size-16);
`;

const Statistics = styled.div`
  position: absolute;
  top: 265px;
  left: 56px;
  font-weight: 600;
`;

const PermissionManagement = styled.div`
  position: absolute;
  top: 527px;
  left: 89px;
  font-size: var(--font-size-20);
  font-weight: 500;
`;

const AllDocuments = styled.div`
  position: absolute;
  top: 640px;
  left: 92px;
  font-size: var(--font-size-20);
  font-weight: 500;
`;

const TermDictionary = styled.div`
  position: absolute;
  top: 694px;
  left: 92px;
  font-size: var(--font-size-20);
  font-weight: 500;
`;

const CompanyRegulations = styled.div`
  position: absolute;
  top: 748px;
  left: 93px;
  font-size: var(--font-size-20);
  font-weight: 500;
`;

const WorkManual = styled.div`
  position: absolute;
  top: 802px;
  left: 93px;
  font-size: var(--font-size-20);
  font-weight: 500;
`;

const ReportForm = styled.div`
  position: absolute;
  top: 856px;
  left: 93px;
  font-size: var(--font-size-20);
  font-weight: 500;
`;

const ScheduleList = styled.div`
  position: absolute;
  top: 1033px;
  left: 93px;
  font-size: var(--font-size-20);
  font-weight: 500;
`;

const ScheduleRegistration = styled.div`
  position: absolute;
  top: 1087px;
  left: 93px;
  font-size: var(--font-size-20);
  font-weight: 500;
`;

const Dashboard = styled.div`
  position: absolute;
  top: 199px;
  left: 56px;
  font-weight: 600;
`;

const UserManagementTitle = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  font-weight: 600;
`;

const UserManagementArrow = styled.div`
  position: absolute;
  top: 4px;
  left: 273px;
  font-size: var(--font-size-16);
  font-weight: 600;
`;

const UserManagementContainer = styled.div`
  position: absolute;
  top: 417px;
  left: 56px;
  width: 289px;
  height: 26px;
`;

const SystemWrapper = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 58px;
  height: 26px;
`;

const SystemTitle = styled.div`
  position: absolute;
  top: 66px;
  left: 24px;
  font-weight: 600;
`;

const SystemContainer = styled.div`
  position: absolute;
  top: 1230px;
  left: 32px;
  width: 63px;
  height: 92px;
`;

const SettingsArrow = styled.div`
  position: absolute;
  top: 976px;
  left: 329px;
  font-weight: 600;
  font-size: var(--font-size-16);
`;

const SettingsTitle = styled.div`
  position: absolute;
  top: 977px;
  left: 56px;
  font-weight: 600;
`;

const UserList = styled.div`
  position: absolute;
  top: 473px;
  left: 89px;
  font-size: var(--font-size-20);
  font-weight: 500;
  color: var(--color-mediumpurple-100);
`;

const SidebarRoot = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 400px;
  height: 100vh;
  min-height: 3041px;
  font-size: var(--font-size-22);
  color: var(--color-dimgray);
  font-family: var(--font-pretendard);
  background-color: var(--color-white);
`;

const Sidebar = ({ className = "" }: SidebarProps) => {
  return (
    <SidebarRoot className={className}>
      <SidebarBackground />
      <DividerLine />
      <Logo alt="" src={LogoImage} />
      <MainMenu>메인</MainMenu>
      <AdminPageTitle>관리자 페이지</AdminPageTitle>
      <DataManagement>데이터 관리</DataManagement>
      <DocumentManagementContainer>
        <DropdownArrow>
          <DropdownIcon>▼</DropdownIcon>
          <DropdownIconText>︎</DropdownIconText>
        </DropdownArrow>
        <DocumentManagement>사내 문서 관리</DocumentManagement>
      </DocumentManagementContainer>
      <MediaManagement>미디어 관리</MediaManagement>
      <FAQManagementContainer>
        <DropdownArrow>
          <DropdownIcon>▼</DropdownIcon>
          <DropdownIconText>︎</DropdownIconText>
        </DropdownArrow>
        <DocumentManagement>FAQ 관리</DocumentManagement>
      </FAQManagementContainer>
      <Statistics>통계</Statistics>
      <PermissionManagement>권한 관리</PermissionManagement>
      <AllDocuments>전체 문서</AllDocuments>
      <TermDictionary>용어 사전</TermDictionary>
      <CompanyRegulations>사내 규정</CompanyRegulations>
      <WorkManual>업무 매뉴얼</WorkManual>
      <ReportForm>보고서 양식</ReportForm>
      <ScheduleList>일정 목록</ScheduleList>
      <ScheduleRegistration>일정 등록</ScheduleRegistration>
      <Dashboard>대시보드</Dashboard>
      <UserManagementContainer>
        <UserManagementTitle>사용자 관리</UserManagementTitle>
        <UserManagementArrow>▼</UserManagementArrow>
      </UserManagementContainer>
      <SystemContainer>
        <SystemWrapper>
          <UserManagementTitle>시스템</UserManagementTitle>
        </SystemWrapper>
        <SystemTitle>설정</SystemTitle>
      </SystemContainer>
      <SettingsArrow>
        <DropdownIcon>▼</DropdownIcon>
        <DropdownIconText>︎</DropdownIconText>
      </SettingsArrow>
      <SettingsTitle>캘린더 관리</SettingsTitle>
      <UserList>사용자 목록</UserList>
    </SidebarRoot>
  );
};

export default Sidebar;
