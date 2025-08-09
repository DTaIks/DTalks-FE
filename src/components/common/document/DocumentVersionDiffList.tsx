import React from 'react';
import styled from 'styled-components';

export type ChangeType = 'insert' | 'delete' | 'equal';

export interface VersionDiffItem {
  content: string;
  changeType: ChangeType;
}

interface VersionDiffListProps {
  item: VersionDiffItem;
}

const VersionDiffList: React.FC<VersionDiffListProps> = ({ item }) => {
  const getStatusIcon = (status: ChangeType): string => {
    switch (status) {
      case 'insert':
        return '+';
      case 'delete':
        return '-';
      case 'equal':
        return '•';
      default:
        return '';
    }
  };

  return (
    <DiffItemContainer status={item.changeType}>
      <StatusIcon status={item.changeType}>
        {getStatusIcon(item.changeType)}
      </StatusIcon>
      <Text>{item.content}</Text>
    </DiffItemContainer>
  );
};

export default VersionDiffList;

const DiffItemContainer = styled.div<{ status: ChangeType }>`
  display: flex;
  align-items: center;
  padding: ${({ status }) => status === 'equal' ? '8px 16px' : '8px 12px'};
  font-size: var(--font-size-16);
  background-color: ${({ status }) => {
    switch (status) {
      case 'insert':
        return '#e6ffed';
      case 'delete':
        return '#ffeef0';
      case 'equal':
        return '#f6f8fa';
      default:
        return 'transparent';
    }
  }};
  border-left: 3px solid ${({ status }) => {
    switch (status) {
      case 'insert':
        return '#28a745';
      case 'delete':
        return '#d73a4a';
      case 'equal':
        return 'none';
      default:
        return 'transparent';
    }
  }};
`;

const StatusIcon = styled.span<{ status: ChangeType }>`
  margin-right: 8px;
  font-weight: 500;
  flex-shrink: 0; 
  color: ${({ status }) => {
    switch (status) {
      case 'insert':
        return '#28a745';
      case 'delete':
        return '#d73a4a';
      case 'equal':
        return '#9ca3af';
      default:
        return '#000';
    }
  }};
`;

const Text = styled.span`
  color: var(--color-black);
  font-weight: var(--font-weight-400);
  min-width: 0; 
  word-break: break-word;
`;
