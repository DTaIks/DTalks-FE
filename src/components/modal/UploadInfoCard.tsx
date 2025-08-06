import React from 'react';
import styled from 'styled-components';

interface UploadInfoCardProps {
  title: string;
  texts: string[];
}

export const UploadInfoCard: React.FC<UploadInfoCardProps> = ({
  title,
  texts
}) => {
  return (
    <InfoCard>
      <InfoTitle>{title}</InfoTitle>
      <InfoList>
        {texts.map((text, index) => (
          <InfoText key={index}>{text}</InfoText>
        ))}
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
  padding: var(--padding-18);
  margin: 0 auto;
  margin-bottom: 4px;
`;

const InfoTitle = styled.h4`
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-600);
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
  gap: var(--gap-4);
`;

const InfoText = styled.li`
  font-size: var(--font-size-15);
  color: var(--color-black);
  position: relative;
  padding-left: 12px;
  font-weight: var(--font-weight-400);
  white-space: pre-line;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #9ca3af;
  }
`;
