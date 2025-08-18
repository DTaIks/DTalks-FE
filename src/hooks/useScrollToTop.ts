import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // 여러 가능한 스크롤 컨테이너들을 시도
    const scrollContainers = [
      document.querySelector('#root'),
      document.querySelector('.main-content'),
      document.querySelector('[data-scroll]'),
      document.querySelector('.layout-container'),
      document.body,
      document.documentElement
    ];

    scrollContainers.forEach(container => {
      if (container) {
        container.scrollTop = 0;
      }
    });

    // window 스크롤도 리셋
    window.scrollTo(0, 0);
  }, [location.pathname]);
};
