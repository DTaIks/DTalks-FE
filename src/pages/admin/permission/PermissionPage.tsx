import styled from "styled-components";
import TitleContainer from "../../../layout/TitleContainer";
import PermissionTable from "../../../components/admin/permission/PermissionTable";

const PermissionPage = () => {
  return (
    <Container>
      <TitleContainer title="권한 관리" subtitle="역할과 권한을 체계적으로 관리하세요" />
      <PermissionTable />
    </Container>
  );
};

export default PermissionPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
`; 