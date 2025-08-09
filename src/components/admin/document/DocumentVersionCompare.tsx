import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '@/components/common/Button';
import CustomDropdown from '@/components/common/CustomDropdown';

interface VersionCompareSectionProps {
  versionOptions: Array<{ value: string; label: string }>;
  isLoadingVersions: boolean;
  isLoading: boolean;
  selectedDocument: string;
  onVersionCompare: (documentName: string, version1: string, version2: string) => void;
}

const VersionCompareSection: React.FC<VersionCompareSectionProps> = ({
  versionOptions,
  isLoadingVersions,
  isLoading,
  selectedDocument,
  onVersionCompare
}) => {
  const [version1, setVersion1] = useState('');
  const [version2, setVersion2] = useState('');

  // 버전 옵션이 변경되면 선택 초기화
  useEffect(() => {
    setVersion1('');
    setVersion2('');
  }, [versionOptions]);

  const handleCompare = () => {
    if (selectedDocument && version1 && version2) {
      onVersionCompare(selectedDocument, version1, version2);
    }
  };

  return (
    <VersionCompareContainer>
      <VersionSelectorGroup>
        <CustomDropdown
          options={versionOptions}
          value={version1}
          onChange={(value) => setVersion1(value)}
          placeholder={
            isLoadingVersions 
              ? "버전 로딩 중..." 
              : versionOptions.length > 0 
                ? "첫 번째 버전" 
                : ""
          }
          width="128px"
          height="34px"
        />
        <Text>VS</Text>
        <CustomDropdown
          options={versionOptions}
          value={version2}
          onChange={(value) => setVersion2(value)}
          placeholder={
            isLoadingVersions 
              ? "버전 로딩 중..." 
              : versionOptions.length > 0 
                ? "두 번째 버전" 
                : ""
          }
          width="128px"
          height="34px"
        />
      </VersionSelectorGroup>
      
      <CompareButtonContainer>
        <Button 
          text={isLoading ? "비교 중..." : "비교"}
          width="80px"
          height="34px"
          fontSize="14px"
          onClick={handleCompare}
          disabled={isLoading || !selectedDocument || !version1 || !version2}
        />
      </CompareButtonContainer>
    </VersionCompareContainer>
  );
};

export default VersionCompareSection;

const VersionCompareContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const VersionSelectorGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CompareButtonContainer = styled.div`
  margin-left: 16px;
`;

const Text = styled.span`
  color: #000;
  font-size: 12px;
  font-weight: 500;
`;