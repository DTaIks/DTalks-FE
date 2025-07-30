// UploadInfoCard.tsx
import React from 'react';
import styled from 'styled-components';

interface UploadInfoCardProps {
  title: string;
  text1: string;
  text2: string;
  text3: string;
}

export const UploadInfoCard: React.FC<UploadInfoCardProps> = ({
  title,
  text1,
  text2,
  text3
}) => {
  return (
    <InfoCard>
      <InfoTitle>{title}</InfoTitle>
      <InfoList>
        <InfoText>{text1}</InfoText>
        <InfoText>{text2}</InfoText>
        <InfoText>{text3}</InfoText>
      </InfoList>
    </InfoCard>
  );
};

const InfoCard = styled.div`
  width: 400px;
  max-width: 100%; 
  box-sizing: border-box; 
  height: 150px;
  border-radius: 7.5px;
  background: rgba(102, 126, 234, 0.10);
  border: none;
  padding: 18px;
  margin: 0 auto;
`;

const InfoTitle = styled.h4`
  font-size: var(--font-size-16);
  font-weight: 600;
  color: #667EEA;
  margin-bottom: 12px;
  margin-top: 0px;
  margin-left: 8px;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoText = styled.li`
  font-size: 15px;
  color: var(--color-black);
  position: relative;
  padding-left: 12px;
  font-weight: 400;
  white-space: pre-line;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #9ca3af;
  }
`;
