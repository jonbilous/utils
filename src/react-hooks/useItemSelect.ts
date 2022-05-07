import { useState, useMemo } from "react";
import useKeydown from "./useKeydown";
import useSet from "./useSet";

const useItemSelect = <T>(data: T[], getId: (item: T) => string) => {
  const set = useSet<string>();

  const shiftDown = useKeydown("ShiftLeft");
  const commandDown = useKeydown("MetaLeft");
  const osLeftDown = useKeydown("OSLeft");

  const ctrlDown = commandDown || osLeftDown;

  const [lastSelectedId, setLastSelectedId] = useState<null | string>(null);

  const handleSelect = (id: string) => {
    if (set.has(id)) {
      setLastSelectedId(null);
      return set.delete([id]);
    }

    if (shiftDown && lastSelectedId) {
      const lastIndex = data.findIndex((item) => {
        return getId(item) === lastSelectedId;
      });

      const currentIndex = data.findIndex((item) => {
        return getId(item) === id;
      });

      const [first, last] = [lastIndex, currentIndex].sort((a, b) =>
        a > b ? 1 : -1
      );

      if ([first, last].every((idx) => idx != null)) {
        return set.add(
          data
            .filter((_, idx) => idx >= first && idx <= last)
            .map((item) => getId(item))
        );
      }
    }

    setLastSelectedId(id);

    if (ctrlDown) {
      return set.add([id]);
    }

    return set.replace([id]);
  };

  const selected = useMemo(() => {
    return [...set].flatMap((id) => {
      const found = data.find((item) => getId(item) === id);
      return found ?? [];
    });
  }, [set, data, getId]);

  const selectAll = () => {
    setLastSelectedId(null);
    set.add(data.map(getId));
  };

  const clearSelection = () => {
    setLastSelectedId(null);
    set.clear();
  };

  return { handleSelect, selected, clearSelection, selectAll };
};

export default useItemSelect;
