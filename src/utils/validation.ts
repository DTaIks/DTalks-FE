export const validateSemver = (version: string): boolean => {
  const semverRegex = /^\d+\.\d+\.\d+$/;
  return semverRegex.test(version);
};

export const semverInput = (input: string): string => {
  // 숫자와 점만 허용
  const cleaned = input.replace(/[^0-9.]/g, '');
  const segments = cleaned.split('.');
  
  // 점이 2개를 초과하면 기존 값 유지
  if (segments.length > 3) {
    return input;
  }
  
  // 각 부분이 숫자로만 구성되는지 확인
  for (const part of segments) {
    if (part !== '' && !/^\d+$/.test(part)) {
      return input;
    }
  }
  
  // 연속된 점이나 점으로 시작하는지 확인
  if (cleaned.includes('..') || cleaned.startsWith('.')) {
    return input;
  }
  
  return cleaned;
};
