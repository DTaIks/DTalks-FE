import { useEffect } from 'react';

interface ScrollLockOptions {
  lockBody?: boolean;
  allowVerticalScroll?: boolean;
  preventHorizontalScroll?: boolean;
}

//모달용 스크롤 락 (기존 기능 유지)
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    // 현재 스크롤바 폭 계산 (사라질 폭만큼 보정)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // 스크롤 막기 + 폭 보정
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      // 원복
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [locked]);
}

/**
 * 범용 스크롤 제어 훅
 * @param enabled - 스크롤 제어 활성화 여부
 * @param options - 스크롤 제어 옵션
 */
export function useScrollControl(enabled: boolean, options: ScrollLockOptions = {}) {
  const {
    lockBody = false,
    allowVerticalScroll = false,
    preventHorizontalScroll = false
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    
    // 기존 스타일 저장
    const originalHtmlOverflow = html.style.overflow;
    const originalHtmlOverflowX = html.style.overflowX;
    const originalHtmlOverflowY = html.style.overflowY;
    const originalBodyOverflow = body.style.overflow;
    const originalBodyOverflowX = body.style.overflowX;
    const originalBodyOverflowY = body.style.overflowY;
    const originalRootOverflow = root?.style.overflow || '';
    const originalRootOverflowX = root?.style.overflowX || '';
    const originalRootOverflowY = root?.style.overflowY || '';

    if (lockBody) {
      // 모달용: 완전히 스크롤 막기
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else if (allowVerticalScroll) {
      // 페이지용: 세로 스크롤만 허용
      html.style.overflow = 'overlay';
      html.style.overflowX = 'hidden';
      html.style.overflowY = 'auto';
      body.style.overflow = 'overlay';
      body.style.overflowX = 'hidden';
      body.style.overflowY = 'auto';
      if (root) {
        root.style.overflow = 'overlay';
        root.style.overflowX = 'hidden';
        root.style.overflowY = 'auto';
      }
    } else if (preventHorizontalScroll) {
      // 가로 스크롤만 방지
      html.style.overflowX = 'hidden';
      body.style.overflowX = 'hidden';
      if (root) root.style.overflowX = 'hidden';
    }
    
    return () => {
      // 원복
      if (lockBody) {
        body.style.overflow = originalBodyOverflow;
        body.style.paddingRight = '';
      } else {
        html.style.overflow = originalHtmlOverflow;
        html.style.overflowX = originalHtmlOverflowX;
        html.style.overflowY = originalHtmlOverflowY;
        body.style.overflow = originalBodyOverflow;
        body.style.overflowX = originalBodyOverflowX;
        body.style.overflowY = originalBodyOverflowY;
        if (root) {
          root.style.overflow = originalRootOverflow;
          root.style.overflowX = originalRootOverflowX;
          root.style.overflowY = originalRootOverflowY;
        }
      }
    };
  }, [enabled, lockBody, allowVerticalScroll, preventHorizontalScroll]);
}
