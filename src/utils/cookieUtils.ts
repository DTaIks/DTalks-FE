// 쿠키 관련 유틸리티 함수들

/**
 * 특정 쿠키 값을 가져오는 함수
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

/**
 * 인증 관련 쿠키가 있는지 확인하는 함수
 */
export const hasAuthCookie = (): boolean => {
  // 일반적인 인증 쿠키 이름들을 확인
  const authCookieNames = [
    'JSESSIONID',      // Java 세션 ID
    'access_token',    // 액세스 토큰
    'auth_token',      // 인증 토큰
    'session',         // 세션 쿠키
    'token',           // 일반적인 토큰
    'Authorization',   // Authorization 쿠키
    'SESSION',         // 대문자 SESSION
    'sessionid',       // 소문자 sessionid
    'connect.sid',     // Express 세션
    'laravel_session', // Laravel 세션
    'django_session',  // Django 세션
    'jwt',             // JWT 토큰
    'refresh_token'    // 리프레시 토큰
  ];

  const foundCookies = authCookieNames.filter(cookieName => getCookie(cookieName) !== null);
  return foundCookies.length > 0;
};

/**
 * 모든 쿠키 목록을 가져오는 함수 (디버깅용)
 */
export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  
  if (typeof document !== 'undefined' && document.cookie) {
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        try {
          cookies[name] = decodeURIComponent(value);
        } catch {
          cookies[name] = value; // decodeURIComponent 실패 시 원본 사용
        }
      }
    });
  }
  
  return cookies;
};

/**
 * 특정 쿠키를 삭제하는 함수
 */
export const deleteCookie = (name: string, path: string = '/', domain?: string): void => {
  let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  if (domain) {
    cookieString += `; domain=${domain}`;
  }
  document.cookie = cookieString;
};
