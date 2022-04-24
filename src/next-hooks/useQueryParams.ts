import { useRouter } from "next/router";

export default () => {
  const router = useRouter();

  const queryParams = router.query as Record<string, string>;

  const setQueryParams = (params: Record<string, string | null>) => {
    const url = new URL(window.location.href);

    for (const [key, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    }

    router.push(url);
  };

  return [queryParams, setQueryParams] as const;
};
