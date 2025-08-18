import styled from "styled-components";
import TitleContainer from "@/layout/TitleContainer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import PermissionTable from "@/components/admin/permission/PermissionTable";

const PermissionPage = () => {
  useScrollToTop();
  
  return (
    <Container>
      <HeaderWrapper>
        <TitleContainer title="권한 관리" subtitle="역할과 권한을 체계적으로 관리하세요" />
      </HeaderWrapper>
      <PermissionTable />
    </Container>
  );
};

export default PermissionPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  position: relative;
  width: 1056px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 32px;
`; 