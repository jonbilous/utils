import { describe, expect, test, vi } from "vitest";
import superjson from "superjson";

describe("cache", () => {
  test("superjson behavior", async () => {
    const obj = { hello: "world" };

    const stringified = superjson.stringify(obj);

    const parsed = superjson.parse<typeof obj>(stringified);

    expect(obj.hello).toBe(parsed.hello);
  });
});
