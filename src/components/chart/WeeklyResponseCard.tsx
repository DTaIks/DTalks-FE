import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import styled from 'styled-components';
import '../../styles/Global.css';

export type WeeklyResponse = {
  values: Array<{ day: string; count: number }>;
};

interface WeeklyResponseStatCardProps {
  data: WeeklyResponse;
}

const WeeklyResponseCard: React.FC<WeeklyResponseStatCardProps> = ({ data }) => {
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
    <Container>
      <CardHeader>
        <CardTitle>일주일간 응답 횟수 통계</CardTitle>
      </CardHeader>
           
      <BarChartWrapper>
        <BarChart
          data={chartData}
          width={1200}
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
    </Container>
  );
};

export default WeeklyResponseCard;

const Container = styled.div`
  width: 1417px;
  border-radius: var(--br-25);
  background: var(--color-white);
  box-shadow: 0px 8px 24px 0px rgba(125, 93, 246, 0.1);
  margin: 60px 0 0px;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  width: 100%;
  height: 100px;
  min-height: 100px;
  flex-shrink: 0;
  border-radius: 25px 25px 0 0;
  border-bottom: 2px solid #e9e0f0;
  background: var(--color-white);
  display: flex;
  align-items: center;
  padding: 0 48px;
  box-sizing: border-box;
`;

const CardTitle = styled.h2`
  font-size: var(--font-size-26);
  font-weight: 600;
  color: var(--color-black);
  margin: 0;
`;

const BarChartWrapper = styled.div`

  border-radius: var(--br-25);
  background: #f9f5ff;
  margin: 60px;
  padding: var(--padding-40);
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
  bottom: 10px;
  right: 40px;
  text-align: right;
`;

const CountInline = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--gap-8);
`;

const Label = styled.div`
  font-size: var(--font-size-16);
  color: var(--color-black);
`;

const DailyAverage = styled.div`
  font-size: var(--font-size-36);
  font-weight: 700;
  color: #9966CC;
`;
