import React from 'react';
import styled from 'styled-components';
import Button from '@/components/common/Button';
import CustomDropdown from '@/components/common/CustomDropdown';

interface GlossaryStats {
  total: number;
  active: number;
  archived: number;
  categories: { name: string; count: number }[];
}

interface GlossaryStatCardProps {
  stats: GlossaryStats;
}

const GlossaryStatCard: React.FC<GlossaryStatCardProps> = () => {
  const versionOptions = [
    { value: "v1.0.0", label: "v1.0.0" },
    { value: "v1.1.0", label: "v1.1.0" },
    { value: "v2.0.0", label: "v2.0.0" },
    { value: "v2.1.0", label: "v2.1.0" }
  ];

  return (
    <Container>
      <ContentContainer>
        <InputBox placeholder="비교할 문서 검색" />
        <VersionCompareContainer>
          <CustomDropdown
            options={versionOptions}
            value=""
            onChange={(value) => console.log('첫 번째 버전 선택:', value)}
            placeholder="버전"
            width="128px"
            height="34px"
          />
          <VSText>VS</VSText>
          <CustomDropdown
            options={versionOptions}
            value=""
            onChange={(value) => console.log('두 번째 버전 선택:', value)}
            placeholder="버전"
            width="128px"
            height="34px"
          />
          <Button 
            text="비교" 
            width="60px" 
            height="34px"
            fontSize="14px"
          />
        </VersionCompareContainer>
      </ContentContainer>
    </Container>
  );
};

export default GlossaryStatCard;

const Container = styled.div`
  width: 1062px;
  height: 96px;
  flex-shrink: 0;
  border-radius: 18px;
  background: #FFF;
  box-shadow: 0 0 11.25px 2.25px rgba(153, 102, 204, 0.05);
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  position: relative;
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputBox = styled.input`
  width: 576px;
  height: 34px;
  flex-shrink: 0;
  border: 1px solid #CCC;
  border-radius: 4px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  
  &::placeholder {
    color: #999;
  }
`;

const VersionCompareContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 24px;
  
  > *:nth-last-child(2) {
    margin-right: 12px;
  }
`;

const VSText = styled.span`
  color: #000;
  font-size: 14px;
  font-weight: 500;
`;
