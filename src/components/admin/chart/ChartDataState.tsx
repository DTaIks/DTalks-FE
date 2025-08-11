import React from 'react';
import styled from 'styled-components';

// 로딩 컴포넌트
interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = '데이터를 불러오는 중' 
}) => {
  return (
    <LoadingContainer>
      <LoadingSpinner />
      <LoadingText>{message}</LoadingText>
    </LoadingContainer>
  );
};

// 에러 컴포넌트
interface ErrorStateProps {
  title?: string;
  message?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = '데이터를 불러올 수 없습니다',
  message 
}) => {
  return (
    <ErrorContainer>
      <ErrorText>{title}</ErrorText>
      {message && <ErrorSubText>{message}</ErrorSubText>}
    </ErrorContainer>
  );
};

// 데이터 없음 컴포넌트
interface NoDataStateProps {
  message?: string;
}

export const NoDataState: React.FC<NoDataStateProps> = ({ 
  message = '데이터가 없습니다' 
}) => {
  return (
    <ErrorContainer>
      <ErrorText>{message}</ErrorText>
    </ErrorContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #9966CC;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: var(--color-gray);
  font-size: var(--font-size-16);
  font-weight: 400;
  margin: 0;
  text-align: center;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
`;

const ErrorText = styled.p`
  color: #EF4444;
  font-size: var(--font-size-18);
  font-weight: 500;
  margin: 0;
  text-align: center;
`;

const ErrorSubText = styled.p`
  color: var(--color-gray);
  font-size: var(--font-size-14);
  font-weight: 400;
  margin: 0;
  text-align: center;
`;
