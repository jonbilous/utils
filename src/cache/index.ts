import { Redis, RedisConfigNodejs } from "@upstash/redis";

export const createCache = (
  cache: {
    get: <T extends unknown>(key: string) => Promise<T>;
    write: <T extends unknown>(
      key: string,
      data: T,
      ttl: number
    ) => Promise<void>;
    flush: (key: string) => Promise<any>;
  },
  defaultTtl: number
) => {
  const withCache = async <Return>(
    key: string,
    fn: () => Promise<Return>,
    ttl?: number
  ): Promise<Return> => {
    const cachedValue = await cache.get<Return>(key).catch((err) => null);

    if (cachedValue) {
      return cachedValue;
    }

    const result = await fn();

    cache.write(key, result, ttl ?? defaultTtl);

    return result;
  };

  return { withCache, ...cache };
};

export const createUpstashRedisCache = (
  config: RedisConfigNodejs,
  defaultTtl: number
) => {
  const redis = new Redis(config);

  const cache = createCache(
    {
      get: (key) =>
        redis.get(key).then((res) => {
          if (typeof res === "string") {
            return JSON.parse(res);
          }
          return res;
        }),
      write: async (key, data, ttl) => {
        await redis.append(key, JSON.stringify(data));
        await redis.expire(key, ttl);
      },
      flush: (key) => redis.expire(key, 0),
    },
    defaultTtl
  );

  return { redis, ...cache };
};
