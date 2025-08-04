import React from 'react';
import styled from 'styled-components';
import Chart from 'react-apexcharts';
import '../../../styles/Global.css';


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
  if (time <= 2) return '#22C55D';  // 0~2초
  if (time <= 5) return '#F59E0C';  // 2~5초
  return '#EF4444';   // 5초 이상
};

function getZoneDetails(zones: number[], total: number): Legend[] {
  const zoneRanges = [
    { range: '0-1초', idx: 0, color: '#22C55D' },
    { range: '1-2초', idx: 1, color: '#22C55D' },
    { range: '2-3초', idx: 2, color: '#F59E0C' },
    { range: '3-5초', idx: 3, color: '#F59E0C' },
    { range: '5초 이상', idx: 4, color: '#EF4444' },
  ];

  return zoneRanges.map(({ range, idx, color }) => {
    const count = zones[idx] || 0;
    const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
    return { range, count, percentage, color };
  });
}

function groupZones(zones: number[], total: number): Zone[] {
  const groupings = [
    { range: '0~2초', indices: [0, 1], color: '#4CAF50' },
    { range: '2~5초', indices: [2, 3], color: '#FF9800' },
    { range: '5초 이상', indices: [4], color: '#F44336' },
  ];

  return groupings.map(({ range, indices, color }) => {
    const count = indices.reduce((sum, i) => sum + (zones[i] || 0), 0);
    const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
    return { range, count, percentage, color };
  });
}

export const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ responseTime }) => {
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
    <ResponseTimeCard>
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
    </ResponseTimeCard>
  );
};

const BaseCard = styled.div`
  flex-shrink: 0;
  border-radius: var(--br-18);
  background: var(--color-white);
  box-shadow: 0 8px 24px rgba(125, 93, 246, 0.1);
`;

const ResponseTimeCard = styled(BaseCard)`
  width: 1062.75px;
  height: 461.25px;
`;

const CardHeader = styled.div`
  width: 100%;
  height: 73.5px;
  border-radius: var(--br-18) var(--br-18) 0 0;
  border-bottom: 1.5px solid #e9e0f0;
  background: var(--color-white);
`;

const CardTitle = styled.h1`
  padding: 24px 285.75px 26.25px 36px;
  font-size: var(--font-size-20);
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
  font-size: var(--font-size-36);
  font-weight: 700;
  margin-bottom: 6px;
`;

const AverageLabel = styled.div`
  color: var(--color-gray);
  font-size: var(--font-size-18);
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
