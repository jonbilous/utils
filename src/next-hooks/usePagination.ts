import useQueryParamState from "./useQueryParamState";

export default () => {
  const [state, setState] = useQueryParamState("1", "page");

  const page = parseInt(state, 10);

  const set = (page: number) => {
    setState(String(page));
  };

  const next = () => {
    set(page + 1);
  };

  const previous = () => {
    if (page > 1) {
      set(page - 1);
    }
  };

  return { current: page, next, previous, set };
};
