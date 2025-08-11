import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import styled from 'styled-components';
import { useWeeklyResponse } from '@/query/useChartQueries';
import { LoadingState, ErrorState, NoDataState } from '@/components/admin/chart/ChartDataState';
import '@/styles/Global.css';

export type WeeklyResponse = {
  values: Array<{ day: string; count: number }>;
};

interface WeeklyResponseStatCardProps {
  data: WeeklyResponse;
}

const WeeklyResponseCardContent: React.FC<WeeklyResponseStatCardProps> = ({ data }) => {
  const chartData = data.values;
  const total = chartData.reduce((sum, item) => sum + item.count, 0);
  const dailyAverage = Math.round(total / chartData.length);
    
  // 최댓값, 최솟값에 따른 막대바 색상 결정
  const counts = chartData.map(item => item.count);
  const max = Math.max(...counts);
  const min = Math.min(...counts);
   
  const getBarColor = (count: number) => {
    if (count === max) {
      return '#7742A7'; // 최댓값
    } else if (count === min) {
      return '#D2BFE8'; // 최솟값
    } else {
      return '#A981D6'; // 나머지
    }
  };
 
  return (
    <>
      <CardHeader>
        <CardTitle>일주일간 응답 횟수 통계</CardTitle>
      </CardHeader>
           
      <BarChartWrapper>
        <BarChart
          data={chartData}
          width={1100}
          height={320}
          margin={{
            top: 40,
            right: 40,
            left: 40,
            bottom: 60,
          }}
          barCategoryGap="5%"
        >
          <XAxis 
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 20, fill: '#000', fontWeight: 600 }}
          />
          <YAxis hide />
          <Bar
            dataKey="count"
            radius={[8, 8, 0, 0]}
            label={{
              position: 'top',
              fontSize: 20,
              fontWeight: 600,
              offset: 4,
              fill: '#000'
            }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.count)} />
            ))}
          </Bar>
        </BarChart>
                 
        <Count>
          <CountInline>
            <Label>일평균 응답</Label>
            <DailyAverage>{dailyAverage.toLocaleString()}건</DailyAverage>
          </CountInline>
        </Count>
      </BarChartWrapper>
    </>
  );
};

const WeeklyResponseCard: React.FC = () => {
  const { data, isLoading, error } = useWeeklyResponse();

  if (isLoading) {
    return (
      <Container>
        <LoadingState message="주간 응답 데이터를 불러오는 중" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorState 
          title="주간 응답 데이터를 불러올 수 없습니다" 
          message={error.message} 
        />
      </Container>
    );
  }

  if (!data) {
    return (
      <Container>
        <NoDataState message="주간 응답 데이터가 없습니다" />
      </Container>
    );
  }

  return (
    <Container>
      <WeeklyResponseCardContent data={data} />
    </Container>
  );
};

export default WeeklyResponseCard;

const Container = styled.div`
  width: 1062.75px;
  border-radius: 18.75px;
  background: var(--color-white);
  box-shadow: 0px 6px 18px 0px rgba(125, 93, 246, 0.1);
  margin: 60px 0px;
  display: flex;
  flex-direction: column;
  outline: none;
  
  &:focus {
    outline: none;
  }
  * {
    outline: none;
  }
  *:focus {
    outline: none;
  }
`;

const CardHeader = styled.div`
  width: 100%;
  height: 76px;
  flex-shrink: 0;
  border-radius: 18.75px 18.75px 0 0;
  border-bottom: 1.5px solid #e9e0f0;
  background: var(--color-white);
  display: flex;
  align-items: center;
  padding: 0 36px;
  box-sizing: border-box;
`;

const CardTitle = styled.h1`
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-600);
  color: var(--color-black);
  white-space: nowrap;
  margin: 0;
`;

const BarChartWrapper = styled.div`
  border-radius: 18.75px;
  background: #f9f5ff;
  margin: 45px;
  padding: 30px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  min-height: 0;
  overflow: hidden;
`;

const Count = styled.div`
  position: absolute;
  bottom: 7.5px;
  right: 30px;
  text-align: right;
`;

const CountInline = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--gap-6);
`;

const Label = styled.div`
  font-size: var(--font-size-15);
  color: var(--color-black);
  margin-bottom: 14.5px;
`;

const DailyAverage = styled.div`
  font-size: var(--font-size-27);
  font-weight: var(--font-weight-700);
  color: var(--color-mediumpurple-300);
`;
