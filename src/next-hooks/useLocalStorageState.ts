import { useState } from "react";

const resolveInitialValue = <T>(fallback: T, key: string): T => {
  const value = localStorage.getItem(key);

  return value ? JSON.parse(value) : fallback;
};

export default <T>(fallback: T, key: string) => {
  const [value, setState] = useState<T>(resolveInitialValue<T>(fallback, key));

  const setValue = (value: T) => {
    setState(value);

    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  };

  return [value, setValue] as const;
};
