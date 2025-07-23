import styled from "styled-components";
import Roll1 from '../../../assets/permission/Roll.svg';
import Roll2 from '../../../assets/permission/Roll2.svg';
import Roll3 from '../../../assets/permission/Roll3.svg';
import ActiveIcon from '../../../assets/Permission/Active.svg';

interface PermissionUser {
  id: number;
  image: string;
  name: string;
  engName: string;
  description: string;
  userCount: string;
  status: string;
}

const permissionData: PermissionUser[] = [
  {
    id: 1,
    image: Roll1,
    name: "관리자",
    engName: "Administrator",
    description: "시스템 관리 및 전체 권한 보유",
    userCount: "1명",
    status: "active",
  },
  {
    id: 2,
    image: Roll2,
    name: "편집자",
    engName: "Editor",
    description: "콘텐츠 관리, 편집 및 게시 권한",
    userCount: "5명",
    status: "active",
  },
  {
    id: 3,
    image: Roll3,
    name: "사용자",
    engName: "User",
    description: "기본 읽기 및 제한된 쓰기 권한",
    userCount: "10명",
    status: "active",
  }
];

// 행 위치 계산 함수
function getRowPositions(rowCount: number, cellHeight: number) {
  const dividerBottom = 205; // 디바이더 선
  const firstRowTop = dividerBottom + 32; // 첫 행 top
  const firstRowCenter = firstRowTop + cellHeight / 2;
  const lastRowCenterMax = 534; // 마지막 행 중앙
  const rowHeight = (lastRowCenterMax - firstRowCenter) / (rowCount - 1);
  return Array.from({ length: rowCount }, (_, idx) => {
    const baseTop = idx === 0 ? firstRowTop : firstRowTop + idx * rowHeight;
    const imageCenterY = baseTop + 32; // 롤 이미지 중앙
    const cellTop = imageCenterY - cellHeight / 2;
    return { baseTop, cellTop };
  });
}

const PermissionTable = () => {
  const cellHeight = 48;
  const rowPositions = getRowPositions(permissionData.length, cellHeight);
  return (
    <Wrapper>
      <Container />
      <Divider />
      <NameColumn>역할명</NameColumn>
      <DescriptionColumn>설명</DescriptionColumn>
      <UserCountColumn>사용자 수</UserCountColumn>
      <StatusColumn>상태</StatusColumn>
      <ActionColumn>작업</ActionColumn>
      <HeaderDivider />
      {permissionData.map((user, idx) => {
        const { baseTop, cellTop } = rowPositions[idx];
        return (
          <div key={user.id}>
            <NameCell style={{ top: `${baseTop}px` }}>
              <RoleImage src={user.image} alt={user.name} />
              <NameTextBox>
                <NameText>{user.name}</NameText>
                <EngNameText>{user.engName}</EngNameText>
              </NameTextBox>
            </NameCell>
            <DescriptionCell style={{ top: `${cellTop}px` }}>{user.description}</DescriptionCell>
            <UserCountCell style={{ top: `${cellTop}px` }}>{user.userCount}</UserCountCell>
            <StatusCell style={{ top: `${cellTop}px` }}>
              <StatusIcon src={ActiveIcon} alt={user.status} />
            </StatusCell>
            <ActionCell style={{ top: `${cellTop}px` }}>
              <ActionText>수정</ActionText>
            </ActionCell>
          </div>
        );
      })}
      <Title>역할 관리</Title>
    </Wrapper>
  );
};

export default PermissionTable;

// styled-components 정의부 (파일 하단)
const Wrapper = styled.div`
  position: absolute;
  top: 275px;
  left: 456px;
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
  height: 590px;
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
const DescriptionColumn = styled(HeaderCell)`
  left: 327px;
  width: 450px;
`;
const UserCountColumn = styled(HeaderCell)`
  left: 800px;
  width: 120px;
`;
const StatusColumn = styled(HeaderCell)`
  left: 1065px;
  display: inline-block;
  width: 120px;
`;
const ActionColumn = styled(HeaderCell)`
  left: 1300px;
  width: 80px;
`;
const DataCell = styled.div`
  position: absolute;
  font-weight: 500;
  font-size: var(--font-size-24);
  color: var(--color-black);
`;
const NameCell = styled(DataCell)`
  left: 49px;
  display: flex;
  align-items: center;
  gap: 15px;
`;
const DescriptionCell = styled(DataCell)`
  left: 327px;
  width: 450px;
`;
const UserCountCell = styled(DataCell)`
  left: 800px;
  width: 120px;
`;
const StatusCell = styled(DataCell)`
  left: 1050px;
  display: inline-block;
  width: 120px;
  height: 48px;
  margin-top: -3px;
`;
const ActionCell = styled(DataCell)`
  left: 1300px;
  width: 80px;
  display: flex;
  gap: 8px;
  align-items: flex-start;
  justify-content: flex-start;
`;
const ActionText = styled.span`
  color: var(--color-black);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  border-radius: 4px;
  transition: color 0.2s;
  &:hover {
    color: var(--color-mediumpurple-300);
  }
`;
const Title = styled.b`
  position: absolute;
  top: 49px;
  left: 48px;
  font-size: var(--font-size-26);
  color: var(--color-black);
`;
const RoleImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #ffa800;
  object-fit: cover;
`;
const NameTextBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const NameText = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: var(--color-black);
  width: 100%;
  text-align: left;
`;
const EngNameText = styled.span`
  font-size: 20px;
  color: #888;
  margin-left: 0;
  width: 100%;
  text-align: left;
`;
const StatusIcon = styled.img`
  width: 75px;
  height: 42px;
  object-fit: contain;
`; 