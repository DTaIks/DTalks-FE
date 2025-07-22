import styled from "styled-components";

interface User {
  id: number;
  name: string;
  department: string;
  role: string;
  email: string;
  top: string;
}

const Wrapper = styled.div`
  position: absolute;
  top: 275px;
  left: 458px;
  width: 1413px;
  height: 434px;
`;

const Container = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  box-shadow: 0px 0px 15px 3px rgba(153, 102, 204, 0.05);
  border-radius: var(--br-8);
  background-color: var(--color-white);
  width: 1413px;
  height: 434px;
  max-width: 100%;
  overflow-x: auto;
`;

const Divider = styled.div`
  position: absolute;
  top: 117px;
  left: -0.2px;
  border-top: 0.5px solid var(--color-darkgray);
  box-sizing: border-box;
  width: 1413.5px;
  height: 0.5px;
`;

const HeaderDivider = styled.div`
  position: absolute;
  top: 205px;
  left: -0.2px;
  border-top: 0.5px solid var(--color-darkgray);
  box-sizing: border-box;
  width: 1413.5px;
  height: 0.5px;
`;

const HeaderCell = styled.div`
  position: absolute;
  top: 152px;
  font-weight: 600;
  font-size: var(--font-size-24);
  color: var(--color-dimgray);
`;

const NameColumn = styled(HeaderCell)`
  left: 49px;
`;
const DepartmentColumn = styled(HeaderCell)`
  left: 327px;
`;
const RoleColumn = styled(HeaderCell)`
  left: 630px;
`;
const EmailColumn = styled(HeaderCell)`
  left: 1000px;
  display: inline-block;
  width: 300px;
`;

const DataCell = styled.div`
  position: absolute;
  font-weight: 500;
  font-size: var(--font-size-24);
  color: var(--color-black);
`;
const NameCell = styled(DataCell)`
  left: 49px;
`;
const DepartmentCell = styled(DataCell)`
  left: 327px;
`;
const RoleCell = styled(DataCell)`
  left: 630px;
`;
const EmailCell = styled(DataCell)`
  left: 1000px;
  display: inline-block;
  width: 300px;
`;

const Title = styled.b`
  position: absolute;
  top: 49px;
  left: 48px;
  font-size: var(--font-size-26);
  color: var(--color-black);
`;

const SearchInput = styled.input`
  border-radius: var(--br-5);
  border: 1px solid var(--color-darkgray);
  width: 240px;
  height: 45px;
  padding: 0 var(--padding-20);
  font-size: var(--font-size-20);
  color: var(--color-darkgray);
  box-sizing: border-box;
  outline: none;
`;

const SearchContainer = styled.div`
  position: absolute;
  top: 41px;
  left: 1125px;
  width: 240px;
  height: 45px;
`;

const userData: User[] = [
  {
    id: 1,
    name: "이주원",
    department: "마케팅팀",
    role: "관리자",
    email: "lee@gachon.ac.kr",
    top: "224px"
  },
  {
    id: 2,
    name: "정지민",
    department: "개발팀",
    role: "편집자",
    email: "jmjung@gachon.ac.kr",
    top: "296px"
  },
  {
    id: 3,
    name: "김동섭",
    department: "디자인팀",
    role: "사용자",
    email: "dongsub@gachon.ac.kr",
    top: "368px"
  }
];

const UserTable = () => {
  return (
    <Wrapper>
      <Container />
      <Divider />
      <NameColumn>이름</NameColumn>
      <DepartmentColumn>부서</DepartmentColumn>
      <RoleColumn>역할</RoleColumn>
      <EmailColumn>이메일</EmailColumn>
      <HeaderDivider />
      {userData.map((user) => (
        <div key={user.id}>
          <NameCell style={{ top: user.top }}>{user.name}</NameCell>
          <DepartmentCell style={{ top: user.top }}>{user.department}</DepartmentCell>
          <RoleCell style={{ top: user.top }}>{user.role}</RoleCell>
          <EmailCell style={{ top: user.top }}>{user.email}</EmailCell>
        </div>
      ))}
      <Title>사용자 목록</Title>
      <SearchContainer>
        <SearchInput placeholder="이름으로 검색" />
      </SearchContainer>
    </Wrapper>
  );
};

export default UserTable; 