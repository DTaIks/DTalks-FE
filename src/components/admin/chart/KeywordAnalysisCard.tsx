import React from 'react';
import styled from 'styled-components';
import '../../../styles/Global.css';

import KeywordRanking1 from '../../../assets/chart/KeywordRanking1.svg';
import KeywordRanking2 from '../../../assets/chart/KeywordRanking2.svg';
import KeywordRanking3 from '../../../assets/chart/KeywordRanking3.svg';

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
  width: 521.25px;
  height: 540px;
  flex-shrink: 0;
  border-radius: 18.75px;
  background: var(--color-white);
  box-shadow: 0 0 7.5px rgba(0, 0, 0, 0.05);
`;

const CardHeader = styled.div`
  width: 100%;
  height: 73.5px;
  border-radius: 19.5px 19.5px 0 0;
  border-bottom: 1.5px solid #e9e0f0;
  background: var(--color-white);
`;

const CardTitle = styled.h1`
  padding: 24px 285.75px 26.25px 36px;
  font-size: var(--font-size-20);
  font-weight: 600;
  color: var(--color-black);
`;

const RankingTitle = styled.h2`
  margin: 22.5px 22.5px 22.5px 39px;
  font-size: var(--font-size-18);
  font-weight: 600;
  color: var(--color-black);
`;

const RankingCard = styled.div`
  width: 461.25px;
  height: 112.5px;
  border-radius: 18.75px;
  background: var(--color-white);
  box-shadow: 0 0 7.5px rgba(0, 0, 0, 0.05);
  margin: 15px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RankingContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 30px;
  gap: 18px;
`;

const IconWrapper = styled.div`
  width: 36px;
  height: 36px;
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
  font-size: var(--font-size-21);
  font-weight: 600;
  color: var(--color-black);
`;

const Count = styled(Keyword)`
  margin-right: 33px;
  text-align: right;
`;
