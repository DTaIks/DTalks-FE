import React from 'react';
import styled from 'styled-components';

interface HeaderProps {
  selectedTeam: string;
  selectedFileType: 'document' | 'image' | 'audio' | 'all';
}

const Header: React.FC<HeaderProps> = ({ selectedTeam }) => {
  return (
    <Container>
      <HeaderContent>
        <TeamName>미디어 파일 / {selectedTeam}</TeamName>
      </HeaderContent>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  width: 100%;
  height: 56px;
  background: var(--color-white);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-radius: 0 25px 0 0;
`;

const HeaderContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
`;

const TeamName = styled.h2`
  color: #555;
  font-size: var(--font-size-16);
  font-weight: 500;
  line-height: normal;
`;
