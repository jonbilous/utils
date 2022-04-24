import { useRouter } from "next/router";

export default (fallback: string, key: string) => {
  const router = useRouter();

  const current = (router.query[key] as string) || fallback;

  const set = (value: string | null) => {
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }

    router.push(url);
  };

  return [current, set] as const;
};
