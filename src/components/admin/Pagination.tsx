import styled from "styled-components";

const Pagination = () => {
  return (
    <PaginationContainer>
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
      <PrevButtonContainer>
        <InactivePageNumber>
          이전
        </InactivePageNumber>
        <PrevButtonBackground />
      </PrevButtonContainer>
    </PaginationContainer>
  );
};

export default Pagination;

const ActivePageBackground = styled.div`
  position: absolute;
  top: 0rem;
  left: 0rem;
  border-radius: var(--br-5);
  background-color: var(--color-mediumpurple-200);
  width: 2.375rem;
  height: 2.375rem;
`;

const ActivePageNumber = styled.div`
  position: absolute;
  top: 0.563rem;
  left: 0.938rem;
`;

const ActivePageContainer = styled.div`
  position: absolute;
  top: 0rem;
  left: 4.375rem;
  width: 2.375rem;
  height: 2.375rem;
  color: var(--color-white);
`;

const InactivePageBackground = styled.div`
  position: absolute;
  top: 0rem;
  left: 0rem;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.35);
  border: 0.5px solid #CCC;
  box-sizing: border-box;
  width: 2.375rem;
  height: 2.375rem;
`;

const InactivePageNumber = styled.div`
  position: absolute;
  top: 0.563rem;
  left: 0.875rem;
`;

const PageContainer2 = styled.div`
  position: absolute;
  top: 0rem;
  left: 7.375rem;
  width: 2.375rem;
  height: 2.375rem;
`;

const PageContainer3 = styled.div`
  position: absolute;
  top: 0rem;
  left: 10.375rem;
  width: 2.375rem;
  height: 2.375rem;
`;

const NextButtonBackground = styled.div`
  position: absolute;
  top: 0rem;
  left: 0rem;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.35);
  border: 0.5px solid #CCC;
  box-sizing: border-box;
  width: 3.75rem;
  height: 2.375rem;
`;

const NextButtonContainer = styled.div`
  position: absolute;
  top: 0rem;
  left: 13.375rem;
  width: 3.75rem;
  height: 2.375rem;
`;

const PrevButtonBackground = styled.div`
  position: absolute;
  top: 0rem;
  left: 0rem;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.35);
  border: 0.5px solid #CCC;
  box-sizing: border-box;
  width: 3.75rem;
  height: 2.375rem;
`;

const PrevButtonContainer = styled.div`
  position: absolute;
  top: 0rem;
  left: 0rem;
  width: 3.75rem;
  height: 2.375rem;
  color: var(--color-silver);
`;

const PaginationContainer = styled.div`
  position: absolute;
  top: 47.688rem;
  left: 64.063rem;
  width: 17.125rem;
  height: 2.375rem;
  font-size: var(--font-size-18);
`; 