import React from 'react';
import styled from 'styled-components';
import '../../styles/Global.css';

import KeywordRanking1 from '../../assets/chart/KeywordRanking1.svg';
import KeywordRanking2 from '../../assets/chart/KeywordRanking2.svg';
import KeywordRanking3 from '../../assets/chart/KeywordRanking3.svg';

export interface Keyword {
  count: number;
  keywords: string[];
  values: number[];
}

interface KeywordAnalysisCardProps {
  keyword: Keyword;
}

const getRankIcon = (rank: number): string => {
  switch (rank) {
    case 1: return KeywordRanking1;
    case 2: return KeywordRanking2;
    case 3: return KeywordRanking3;
    default: return KeywordRanking1; 
  }
};

const formatRanking = (data: Keyword) => {
  return data.keywords.map((keyword, index) => ({
    rank: index + 1,
    keyword,
    count: data.values[index],
    icon: getRankIcon(index + 1)
  }));
};

export const KeywordAnalysisCard: React.FC<KeywordAnalysisCardProps> = ({ keyword: keyword }) => {
  const ranking = formatRanking(keyword);

  return (
    <Container>
      <CardHeader>
        <CardTitle>질문 키워드 분석</CardTitle>
      </CardHeader>

      <RankingTitle>주요 키워드 순위</RankingTitle>
      {ranking.map(({ rank, keyword, count, icon }) => (
        <RankingCard key={rank}>
          <RankingContent>
            <IconWrapper>
              <img src={icon} alt={`${rank}위`} />
            </IconWrapper>
            <Stats>
              <Keyword>{keyword}</Keyword>
              <Count>{count.toLocaleString()}회</Count>
            </Stats>
          </RankingContent>
        </RankingCard>
      ))}
    </Container>
  );
};

const Container = styled.div`
  width: 695px;
  height: 720px;
  flex-shrink: 0;
  border-radius: var(--br-25);
  background: var(--color-white);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
`;

const CardHeader = styled.div`
  width: 100%;
  height: 98px;
  border-radius: 26px 26px 0 0;
  border-bottom: 2px solid #e9e0f0;
  background: var(--color-white);
`;

const CardTitle = styled.h1`
  padding: 32px 381px 35px 48px;
  font-size: var(--font-size-26);
  font-weight: 600;
  color: var(--color-black);
`;



const RankingTitle = styled.h2`
  margin: 30px 30px 30px 52px;
  font-size: var(--font-size-24);
  font-weight: 600;
  color: var(--color-black);
`;

const RankingCard = styled.div`
  width: 615px;
  height: 150px;
  border-radius: var(--br-25);
  background: var(--color-white);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  margin: 12px auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RankingContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 40px;
  gap: var(--gap-24);
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Stats = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Keyword = styled.div`
  font-size: var(--font-size-28);
  font-weight: 600;
  color: var(--color-black);
`;

const Count = styled(Keyword)`
  margin-right: 44px;
  text-align: right;
`;
