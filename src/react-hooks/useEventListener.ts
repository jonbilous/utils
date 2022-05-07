import { useEffect } from "react";

const useEventListener = <K extends keyof WindowEventMap>(
  event: K,
  handler: (event: WindowEventMap[K]) => any
) => {
  useEffect(() => {
    window.addEventListener(event, handler);

    return () => {
      window.removeEventListener(event, handler);
    };
  }, [event, handler]);
};

export default useEventListener;
