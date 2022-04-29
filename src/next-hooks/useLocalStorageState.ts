import { useEffect, useState } from "react";

const resolveInitialValue = <T>(fallback: T, key: string): T => {
  const value = localStorage.getItem(key);

  return value ? JSON.parse(value) : fallback;
};

export default <T>(fallback: T, key: string) => {
  const [value, setState] = useState<T>(fallback);

  const setValue = (value: T) => {
    setState(value);

    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  };

  useEffect(() => {
    resolveInitialValue<T>(fallback, key);
  }, [fallback, key]);

  return [value, setValue] as const;
};
