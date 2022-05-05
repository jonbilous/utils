import { useEffect, useState } from "react";
import useIsLoading from "./useIsLoading";

export const useOnClickLoader = () => {
  const isLoading = useIsLoading();

  const [touched, setTouched] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (touched) {
      timeout = setTimeout(() => {
        setTouched(false);
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [touched]);

  const onClick = () => {
    setTouched(true);
  };

  return { isLoading, onClick };
};
