import { useEffect, useState } from "react";

const resolveInitialValue = <T>(fallback: T, key: string): T => {
  const value = localStorage.getItem(key);

  return value ? JSON.parse(value) : fallback;
};

export default <T>(fallback: T, key: string) => {
  const [value, setState] = useState<T>(fallback);

  const setValue = (value: T) => {
    setState(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  useEffect(() => {
    const initalValue = resolveInitialValue<T>(fallback, key);
    setState(initalValue);
  }, [fallback, key]);

  return [value, setValue] as const;
};
