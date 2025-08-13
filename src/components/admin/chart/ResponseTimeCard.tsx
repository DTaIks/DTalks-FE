import React from 'react';
import styled from 'styled-components';
import Chart from 'react-apexcharts';
import { useResponseTime } from '@/query/useChartQueries';
import { LoadingState, ErrorState, NoDataState } from '@/components/admin/chart/ChartDataState';
import '@/styles/Global.css';

export interface ResponseTime {
  avg: number;
  zones: number[];
}

interface Zone {
  range: string;
  count: number;
  percentage: number;
  color: string;
}

interface Legend {
  range: string;
  count: number;
  percentage: number;
  color: string;
}

interface ResponseTimeChartProps {
  responseTime: ResponseTime;
}

// 응답시간에 따른 프로그래스바 색상
const getAverageTimeColor = (time: number): string => {
  if (time <= 10) return '#22C55D';  // 0~10초
  if (time <= 20) return '#F59E0C';  // 10~20초
  return '#EF4444';   // 20초 이상
};
  
function getZoneDetails(zones: number[], total: number): Legend[] {
  const zoneRanges = [
    { range: '0-5초', idx: 0, color: '#22C55D' },
    { range: '5-10초', idx: 1, color: '#22C55D' },
    { range: '10-15초', idx: 2, color: '#F59E0C' },
    { range: '15-20초', idx: 3, color: '#F59E0C' },
    { range: '20초 이상', idx: 4, color: '#EF4444' },
  ];

  return zoneRanges.map(({ range, idx, color }) => {
    const count = zones[idx] || 0;
    const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
    return { range, count, percentage, color };
  });
}

function groupZones(zones: number[], total: number): Zone[] {
  const groupings = [
    { range: '0~10초', indices: [0, 1], color: '#4CAF50' },
    { range: '10~20초', indices: [2, 3], color: '#FF9800' },
    { range: '20초 이상', indices: [4], color: '#F44336' },
  ];

  return groupings.map(({ range, indices, color }) => {
    const count = indices.reduce((sum, i) => sum + (zones[i] || 0), 0);
    const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
    return { range, count, percentage, color };
  });
}

// 차트 내용 컴포넌트
const ResponseTimeChartContent: React.FC<ResponseTimeChartProps> = ({ responseTime }) => {
  const { avg, zones } = responseTime;
  const total = zones.reduce((sum, v) => sum + v, 0);

  const legend = getZoneDetails(zones, total);
  const groupedZones = groupZones(zones, total);

  const donutChartOptions = {
    chart: {
      type: 'donut' as const,
      width: 280,
      height: 280,
      animations: { enabled: false },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          labels: { show: false },
        },
      },
    },
    colors: groupedZones.map((d) => d.color),
    labels: groupedZones.map((d) => d.range),
    legend: { show: false },
    dataLabels: { enabled: false },
    states: {
      hover: {
        filter: {
          type: 'darken',
        }
      }
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number, opts: { seriesIndex: number }) => {
          const idx = opts.seriesIndex;
          return `${groupedZones[idx].count}건 (${val}%)`;
        },
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['#ffffff'],
    },
  };

  const donutChartSeries = groupedZones.map((d) => d.percentage);

  return (
    <>
      <CardHeader>
        <CardTitle>응답 시간 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartWrapper>
          <Chart options={donutChartOptions} series={donutChartSeries} type="donut" width={240} height={240} />
          <CenterContent>
            <AverageTime color={getAverageTimeColor(avg)}>{avg}초</AverageTime>
            <AverageLabel>평균 응답 시간</AverageLabel>
          </CenterContent>
        </ChartWrapper>
        <LegendContainer>
          {legend.map(({ range, color, count, percentage }) => (
            <LegendItem key={range}>
              <LegendDot color={color} />
              <LegendRange>{range}</LegendRange>
              <LegendStats>
                <LegendCount>{count}건</LegendCount>
                <LegendPercentage>{percentage}%</LegendPercentage>
              </LegendStats>
            </LegendItem>
          ))}
        </LegendContainer>
      </CardContent>
    </>
  );
};

export const ResponseTimeChart: React.FC = () => {
  const { data, isLoading, error } = useResponseTime();

  if (isLoading) {
    return (
      <ResponseTimeCard>
        <LoadingState message="응답 시간 데이터를 불러오는 중" />
      </ResponseTimeCard>
    );
  }

  if (error) {
    return (
      <ResponseTimeCard>
        <ErrorState 
          title="응답 시간 데이터를 불러올 수 없습니다" 
          message={error.message} 
        />
      </ResponseTimeCard>
    );
  }

  if (!data) {
    return (
      <ResponseTimeCard>
        <NoDataState message="응답 시간 데이터가 없습니다" />
      </ResponseTimeCard>
    );
  }

  return (
    <ResponseTimeCard>
      <ResponseTimeChartContent responseTime={data} />
    </ResponseTimeCard>
  );
};

const ResponseTimeCard = styled.div`
  width: 1062px;
  height: 463px;
  flex-shrink: 0;
  border-radius: var(--br-18);
  background: var(--color-white);
  box-shadow: 0 8px 24px rgba(125, 93, 246, 0.1);
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  width: 100%;
  height: 76px;
  border-radius: 19.5px 19.5px 0 0;
  border-bottom: 1.5px solid #e9e0f0;
  background: var(--color-white);
  display: flex;
  align-items: center; 
  box-sizing: border-box;
`;

const CardTitle = styled.h1`
  padding: 26px 0px 26px 36px;
  font-size: var(--font-size-18);
  font-weight: 600;
  color: var(--color-black);
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 60px 45px 60px;
  height: calc(100% - 110px);
`;

const ChartWrapper = styled.div`
  position: relative;
  width: 240px;
  height: 240px;
  margin-left: 45px;
`;

const CenterContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const AverageTime = styled.div<{ color: string }>`
  color: ${({ color }) => color};
  font-size: var(--font-size-32);
  font-weight: 700;
  margin-bottom: 6px;
`;

const AverageLabel = styled.div`
  color: var(--color-gray);
  font-size: var(--font-size-16);
  font-weight: 500;
`;

const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--gap-18);
  flex: 0.8;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-12);
  border-bottom: 0.75px solid #d9d9d9;
  height: 68px;
`;

const LegendDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  flex-shrink: 0;
`;

const LegendRange = styled.span`
  color: var(--color-gray);
  font-size: var(--font-size-14);
  font-weight: 500;
  min-width: 60px;
`;

const LegendStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: auto;
`;

const LegendCount = styled.span`
  color: var(--color-black);
  font-size: var(--font-size-15);
  font-weight: 600;
`;

const LegendPercentage = styled.span`
  color: var(--color-gray);
  font-size: var(--font-size-12);
  font-weight: 400;
`;
