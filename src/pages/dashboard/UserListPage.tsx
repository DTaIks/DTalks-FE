import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import UserTitleContainer from "../../components/TitleContainer";
import Pagination from "../../components/Pagination";
import UserTable from "../../components/UserTable";

const animationFadeIn = keyframes`
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
  `;

const DivRoot = styled.div`
  width: 100%;
  position: relative;
  background-color: var(--color-ghostwhite);
  min-height: 3041px;
  overflow: hidden;
  text-align: left;
  font-size: var(--font-size-24);
  color: var(--color-black);
  font-family: var(--font-pretendard);
  @media screen and (max-width: 1920px) and (max-height: 1080px) {
    opacity: 0;
    &.animate {
      animation: 1s ease 0s 1 normal forwards ${animationFadeIn};
    }
  }
`;

const Component1 = () => {
  useEffect(() => {
    const scrollAnimElements = document.querySelectorAll(
      "[data-animate-on-scroll]",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            const targetElement = entry.target;
            targetElement.classList.add("animate");
            observer.unobserve(targetElement);
          }
        }
      },
      {
        threshold: 0.15,
      },
    );
    for (let i = 0; i < scrollAnimElements.length; i++) {
      observer.observe(scrollAnimElements[i]);
    }

    return () => {
      for (let i = 0; i < scrollAnimElements.length; i++) {
        observer.unobserve(scrollAnimElements[i]);
      }
    };
  }, []);

  return (
    <DivRoot data-animate-on-scroll className="user-list-page">
      <Navbar />
      <Sidebar />
      <UserTitleContainer />
      <UserTable />
      <Pagination />
    </DivRoot>
  );
};

export default Component1;
