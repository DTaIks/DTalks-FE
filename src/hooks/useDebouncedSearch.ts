import { useState, useEffect } from 'react';

interface UseDebouncedSearchReturn {
  debouncedValue: string;
  isDebouncing: boolean;
}

export const useDebouncedSearch = (value: string, delay: number = 500): UseDebouncedSearchReturn => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    if (value) {
      setIsDebouncing(true);
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
};
