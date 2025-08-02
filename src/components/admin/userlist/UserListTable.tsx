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
      <Wrapper>
        <TableHeader>
          <div>이름</div>
          <div>부서</div>
          <div>역할</div>
          <div>이메일</div>
        </TableHeader>
        <Divider />
        {userData.map((user) => (
          <TableRow key={user.id}>
            <div>{user.name}</div>
            <div>{user.department}</div>
            <div>{user.role}</div>
            <div>{user.email}</div>
          </TableRow>
        ))}
      </Wrapper>
    </>
  );
};

export default UserTable;

const Wrapper = styled.div`
  width: 989.33px;
  margin: 0 auto 12px auto;
  background: var(--color-white);
  border-radius: var(--br-18);
  box-shadow: 0px 0px 11.25px 2.25px rgba(153, 102, 204, 0.05);
  padding: 20px 36px 24px 36px;
  overflow-x: hidden;
  position: relative;
`;
const TableGrid = `display: grid; grid-template-columns: 1.5fr 1.5fr 1.5fr 2.2fr; align-items: center; row-gap: 0;`;
const Divider = styled.div`
  position: relative;
  left: -36px;
  width: calc(100% + 72px);
  height: 1px;
  background: var(--color-divider);
  margin: 0;
`;
const TableHeader = styled.div`
  ${TableGrid}
  color: #2D1457;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 0;
  margin-top: 0px;
  background: transparent;
  min-height: 48px;
  padding: 0 0 16px 0;
`;
const TableRow = styled.div`  ${TableGrid}
  margin-top: 8px;
  font-weight: 500;
  font-size: 18px;
  color: var(--color-black);
  background: transparent;
  min-height: 48px;
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
