import styled from "styled-components";
import PermissionTable from "../../../components/admin/permission/PermissionTable";

const PermissionPage = () => {
  return (
    <Container>
      <PermissionTable />
    </Container>
  );
};

export default PermissionPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
`; 