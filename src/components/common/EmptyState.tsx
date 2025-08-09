import React from "react";
import styled from "styled-components";

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "검색 결과가 없습니다.",
  subMessage,
  icon
}) => {
  // 메시지에 따른 기본 서브메시지 설정
  const getDefaultSubMessage = (msg: string): string => {
    if (msg.includes("불러오는데 실패")) {
      return "잠시 후 다시 시도해주세요.";
    }
    if (msg.includes("등록된") && msg.includes("없습니다")) {
      return "새로운 항목을 추가해보세요.";
    }
    return "다른 검색어를 입력해보세요.";
  };

  const finalSubMessage = subMessage || getDefaultSubMessage(message);

  return (
    <Container>
      {icon && <EmptyIcon>{icon}</EmptyIcon>}
      <EmptyMessage>{message}</EmptyMessage>
      <EmptySubMessage>{finalSubMessage}</EmptySubMessage>
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
  font-size: 12px;
  color: #999;
`;
