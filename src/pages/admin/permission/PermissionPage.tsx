import styled from "styled-components";
import PermissionTable from "../../../components/admin/PermissionTable";
// 필요시 Pagination, TitleContainer 등 import

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const PermissionPage = () => {
  return (
    <Container>
      {/* 추후 권한 관리용 TitleContainer 등 추가 가능 */}
      <PermissionTable />
      {/* <Pagination /> 등도 필요시 추가 */}
    </Container>
  );
};

export default PermissionPage; 