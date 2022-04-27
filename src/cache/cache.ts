import { Redis, RedisConfigNodejs } from "@upstash/redis";
import superjson from "superjson";
import { SuperJSONResult } from "superjson/dist/types";

export const createCache = (
  cache: {
    get: <T extends unknown>(key: string) => Promise<T>;
    write: <T extends unknown>(
      key: string,
      data: T,
      ttl?: number
    ) => Promise<void>;
    flush: (key: string) => Promise<any>;
    flushAll: () => Promise<any>;
  },
  defaultTtl: number
) => {
  const withCache = <Return, ArgType, Args extends ArgType[]>(
    keyFn: (...args: Args) => string | string[],
    fn: (...args: Args) => Promise<Return>,
    ttl?: number
  ) => {
    return async (...args: Args): Promise<Return> => {
      const keyResult = keyFn(...args);

      const key =
        typeof keyResult === "string" ? keyResult : keyResult.join("-");

      const cachedValue = await cache.get<Return>(key).catch((err) => null);

      if (cachedValue) {
        return cachedValue;
      }

      const result = await fn(...args);

      cache.write(key, result, ttl ?? defaultTtl);

      return result;
    };
  };

  return { withCache, ...cache };
};

export const createUpstashRedisCache = (
  config: RedisConfigNodejs,
  defaultTtl: number
) => {
  const redis = new Redis({ ...config });

  const cache = createCache(
    {
      get: <T>(key: string): Promise<T> =>
        redis.get(key).then((res) => {
          try {
            return superjson.deserialize(res as SuperJSONResult) as T;
          } catch (err) {
            return null as any as T;
          }
        }),
      write: async (key, data, ttl) => {
        const serialized = superjson.serialize(data);
        await redis.set(key, serialized, {});
        await redis.expire(key, ttl ?? defaultTtl);
      },
      flush: (key) => redis.expire(key, 0),
      flushAll: () => redis.flushall({ async: true }),
    },
    defaultTtl
  );

  return { redis, ...cache };
};
