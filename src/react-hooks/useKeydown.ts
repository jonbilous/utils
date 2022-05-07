import { useState } from "react";
import useEventListener from "./useEventListener";

const useKeydown = (key: string) => {
  const [keydown, setKeydown] = useState(false);

  useEventListener("keydown", (e) => {
    if (key === e.code) {
      setKeydown(true);
    }
  });

  useEventListener("keyup", (e) => {
    if (key === e.code) {
      setKeydown(false);
    }
  });

  return keydown;
};

export default useKeydown;
