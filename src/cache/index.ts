import { Redis, RedisConfigNodejs } from "@upstash/redis";

export const createCache = <T>(
  cache: {
    get: (key: string) => Promise<T>;
    write: (key: string, data: T, ttl: number) => Promise<void>;
    flush: (key: string) => Promise<any>;
  },
  defaultTtl: number
) => {
  const withCache = async (
    key: string,
    fn: () => Promise<T>,
    ttl?: number
  ): Promise<T> => {
    const cachedValue = await cache.get(key).catch((err) => null);

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
