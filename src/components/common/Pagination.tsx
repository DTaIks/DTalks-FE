import styled from "styled-components";

const Pagination = () => {
  return (
    <PaginationContainer>
      <PrevButtonContainer>
        <PrevButtonBackground />
        <InactivePageNumber>
          이전
        </InactivePageNumber>
      </PrevButtonContainer>
      <ActivePageContainer>
        <ActivePageBackground />
        <ActivePageNumber>
          1
        </ActivePageNumber>
      </ActivePageContainer>
      <PageContainer2>
        <InactivePageBackground />
        <InactivePageNumber>
          2
        </InactivePageNumber>
      </PageContainer2>
      <PageContainer3>
        <InactivePageBackground />
        <InactivePageNumber>
          3
        </InactivePageNumber>
      </PageContainer3>
      <NextButtonContainer>
        <NextButtonBackground />
        <InactivePageNumber>
          다음
        </InactivePageNumber>
      </NextButtonContainer>
    </PaginationContainer>
  );
};

export default Pagination;

const ActivePageBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3.75px;
  background-color: var(--color-mediumpurple-200);
  width: 1.78rem;
  height: 1.78rem;
`;

const ActivePageNumber = styled.div`
  z-index: 1;
  position: absolute;
  top: 0.422rem;
  left: 0.704rem;
`;

const ActivePageContainer = styled.div`
  width: 1.78rem;
  height: 1.78rem;
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 4px;
`;

const InactivePageBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3.75px;
  background: rgba(255, 255, 255, 0.35);
  border: 0.375px solid #CCC;
  box-sizing: border-box;
  width: 1.78rem;
  height: 1.78rem;
`;

const InactivePageNumber = styled.div`
  z-index: 1;
  position: absolute;
  top: 0.422rem;
  left: 0.656rem;
  
`;

const PageContainer2 = styled.div`
  width: 1.78rem;
  height: 1.78rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 4px;
`;

const PageContainer3 = styled.div`
  width: 1.78rem;
  height: 1.78rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const NextButtonBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3.75px;
  background: #FFF;
  border: 0.375px solid #CCC;
  box-sizing: border-box;
  width: 2.81rem;
  height: 1.78rem;
`;

const NextButtonContainer = styled.div`
  width: 2.81rem;
  height: 1.78rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-left: 4px;
`;

const PrevButtonBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3.75px;
  background: rgba(255, 255, 255, 0.35);
  border: 0.375px solid #CCC;
  box-sizing: border-box;
  width: 2.81rem;
  height: 1.78rem;

`;

const PrevButtonContainer = styled.div`
  width: 2.81rem;
  height: 1.78rem;
  color: var(--color-silver);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 4px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 1.78rem;
  font-size: 0.844rem;
  margin-top: 24px;
  position: relative;
`; 