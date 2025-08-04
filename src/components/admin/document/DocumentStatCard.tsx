import styled from "styled-components";

interface StatData {
  title: string;
  value: string;
  additionalInfo?: string;
}

interface DocumentStatCardProps {
  stats: StatData[];
}

const DocumentStatCard: React.FC<DocumentStatCardProps> = ({ stats }) => {
  return (
    <StatContainer>
      {stats.map((stat, index) => (
        <StatBox key={index}>
          <LeftSection>
            <StatTitle>{stat.title}</StatTitle>
            {stat.additionalInfo && (
              <AdditionalInfo>{stat.additionalInfo}</AdditionalInfo>
            )}
          </LeftSection>
          <RightSection>
            <StatValue>{stat.value}</StatValue>
          </RightSection>
        </StatBox>
      ))}
    </StatContainer>
  );
};

export default DocumentStatCard;

const StatContainer = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
`;

const StatBox = styled.div`
  width: 290px;
  height: 64px;
  flex-shrink: 0;
  background: var(--color-white);
  border-radius: var(--br-18);
  box-shadow: 0px 0px 11.25px 2.25px rgba(153, 102, 204, 0.05);
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 24px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  padding-right: 24px;
`;

const StatTitle = styled.div`
  color: var(--color-black);
  font-size: var(--font-size-16);
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const AdditionalInfo = styled.div`
  color: #22C55E;
  font-size: var(--font-size-16);
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const StatValue = styled.div`
  color: var(--color-black);
  font-size: var(--font-size-28);
  font-weight: 600;
`; 