import { useEffect, useState } from 'react';

const useDebounce = (initialValue: string, delay: number) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsLoading(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  const updateValue = (newValue: string) => {
    setValue(newValue);
  };

  return { debouncedValue, updateValue, value, isLoading };
};

export default useDebounce;
