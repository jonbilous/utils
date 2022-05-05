import { useCallback, useState } from "react";

interface ISet<T extends string | number>
  extends Omit<Set<T>, "add" | "delete" | "toggle" | "clear"> {
  add: (values: T[]) => void;
  delete: (values: T[]) => void;
  replace: (values: T[]) => void;
  toggle: (value: T) => void;
  clear: () => void;
}

const useSet = <T extends string | number>(): ISet<T> => {
  const [state, setState] = useState(new Set<T>());

  const add = useCallback((values: T[]) => {
    setState((current) => {
      const cloned = new Set(current);

      for (const value of values) {
        cloned.add(value);
      }

      return cloned;
    });
  }, []);

  const remove = useCallback((values: T[]) => {
    setState((current) => {
      const cloned = new Set(current);

      for (const value of values) {
        cloned.delete(value);
      }

      return cloned;
    });
  }, []);

  const toggle = useCallback((value: T) => {
    setState((current) => {
      const cloned = new Set(current);

      cloned.has(value) ? cloned.delete(value) : cloned.add(value);

      return cloned;
    });
  }, []);

  const clear = useCallback(() => {
    setState((current) => {
      const cloned = new Set(current);

      cloned.clear();

      return cloned;
    });
  }, []);

  const replace = useCallback((values: T[]) => {
    setState(() => {
      return new Set(values);
    });
  }, []);

  const set = state as any;

  set.delete = remove;
  set.add = add;
  set.replace = replace;
  set.clear = clear;
  set.toggle = toggle;

  return set as ISet<T>;
};

export default useSet;
