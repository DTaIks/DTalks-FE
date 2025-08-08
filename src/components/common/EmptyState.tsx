import React from "react";
import styled from "styled-components";

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "검색 결과가 없습니다." 
}) => {
  return (
    <Container>
      <EmptyIcon>🔍</EmptyIcon>
      <EmptyMessage>{message}</EmptyMessage>
      <EmptySubMessage>다른 검색어를 입력해보세요.</EmptySubMessage>
    </Container>
  );
};

export default EmptyState;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #fff;
  border-radius: 0 0 18px 18px;
  height: 240px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
`;

const EmptyMessage = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
`;

const EmptySubMessage = styled.div`
  font-size: 14px;
  color: #999;
`;
