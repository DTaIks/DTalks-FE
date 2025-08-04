import styled from "styled-components";

interface User {
  id: number;
  name: string;
  department: string;
  role: string;
  email: string;
}

const userData: User[] = [
  {
    id: 1,
    name: "이주원",
    department: "마케팅팀",
    role: "관리자",
    email: "lee@gachon.ac.kr"
  },
  {
    id: 2,
    name: "정지민",
    department: "개발팀",
    role: "편집자",
    email: "jmjung@gachon.ac.kr"
  },
  {
    id: 3,
    name: "김동섭",
    department: "디자인팀",
    role: "사용자",
    email: "dongsub@gachon.ac.kr"
  }
];

const UserTable = () => {
  return (
    <>
      <SearchContainerOutside>
        <SearchInput placeholder="이름으로 검색" />
      </SearchContainerOutside>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>부서</TableCell>
              <TableCell>역할</TableCell>
              <TableCell>이메일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <NameText>{user.name}</NameText>
                </TableCell>
                <TableCell>
                  <DepartmentText>{user.department}</DepartmentText>
                </TableCell>
                <TableCell>
                  <RoleText>{user.role}</RoleText>
                </TableCell>
                <TableCell>
                  <EmailText>{user.email}</EmailText>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UserTable;

const TableContainer = styled.div`
  width: 1062px;
  margin: 0 auto 12px auto;
  background: var(--color-white);
  border-radius: var(--br-18);
  box-shadow: 0px 0px 11.25px 2.25px rgba(153, 102, 204, 0.05);
  overflow: hidden;
  padding-bottom: 32px;
`;

const Table = styled.div`
  width: 100%;
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #000;
  font-size: var(--font-size-16);
  font-weight: 500;
  
  &:nth-child(1) {
    width: 25%;
  }
  
  &:nth-child(2) {
    width: 25%;
  }
  
  &:nth-child(3) {
    width: 25%;
  }
  
  &:nth-child(4) {
    width: 40%;
  }
`;

const TableHead = styled.div`
  height: 60px;
  border-bottom: 1.5px solid #E9E0F0;
  background: #FFF;
  display: flex;
  align-items: center;
  font-weight: 600;
  
  ${TableCell} {
    color: #2D1457;
  }
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 28px;
`;

const TableRow = styled.div`
  width: 989.33px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
  padding-left: 36px;
`;

const NameText = styled.span`
  color: var(--color-black);
  font-size: 16px;
  font-weight: 500;
`;

const DepartmentText = styled.span`
  color: var(--color-black);
  font-size: 16px;
  font-weight: 500;
`;

const RoleText = styled.span`
  color: var(--color-black);
  font-size: 16px;
  font-weight: 500;
`;

const EmailText = styled.span`
  color: var(--color-black);
  font-size: 16px;
  font-weight: 500;
`;

const SearchInput = styled.input`
  border-radius: var(--br-8);
  border: 0.75px solid var(--color-darkgray);
  width: 180px;
  height: 33.75px;
  padding: 0 15px;
  font-size: 15px;
  color: var(--color-darkgray);
  box-sizing: border-box;
  outline: none;
  margin-left: 10px;
`;

const SearchContainerOutside = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 989.33px;
  margin: 0 auto 16px auto;
  margin-left: 72px;
`; 
