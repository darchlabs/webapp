import type { ICache, Cache } from "./types";
import { createClient } from "redis";
import type { RedisClientType, RedisModules } from "redis";

export default class implements ICache {
  private client: RedisClientType<RedisModules>;

  constructor(url: string) {
    this.client = createClient({
      url,
      // legacyMode: true,
    });
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.on("connect", resolve);
      this.client.on("error", reject);
    });
  }

  public async get<T>(key: string): Promise<T | undefined> {
    // connect redis client
    if (!this.client.isReady) {
      await this.client.connect();
    }

    // get data by key from redis
    let value: string | null;

    try {
      value = await this.client.get(key);
      if (value === null) {
        return undefined;
      }

      if (typeof value != "string" || value.length === 0) {
        throw new Error("invalid type");
      }

      // parse save value to T type
      const parse = JSON.parse(value) as T;

      return parse;
    } catch (err) {
      throw err;
    }
  }

  public async set<T>(key: string, data: T): Promise<void> {
    if (typeof data !== "object" && !Array.isArray(data)) {
      throw new Error("invalid type");
    }

    await this.client.set(key, JSON.stringify(data));
  }

  public async getBatch<T>(keys: string[]): Promise<T[]> {
    if (keys.length === 0) {
      throw new Error("empty keys array param");
    }

    const values = await this.client.mGet(keys);
    if (values == null) {
      throw new Error("no key has been found in the cache");
    }

    const parsedValues: T[] = values.reduce((arr: T[], item: any) => {
      if (item) {
        arr.push(JSON.parse(item));
      }
      return arr;
    }, [] as T[]);

    return parsedValues;
  }

  public async setBatch<T extends Cache>(data: T[]): Promise<void> {
    if (data.length === 0) {
      return;
    }

    const values = [];
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      if (!d.id) {
        throw new Error(`invalid id data object with index ${i}`);
      }

      values.push(d.id, JSON.stringify(d));
    }

    await this.client.mSet(values);
  }

  public async del(key: string): Promise<boolean> {
    const res = await this.client.del(`${key}`);
    return !!res;
  }

  public async flush(): Promise<boolean> {
    const res = await this.client.flushAll();
    return !!res;
  }

  public async deleteBatch(keys: string[]): Promise<Cache[]> {
    const deleted: Cache[] = [];

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      try {
        const res = await this.del(key);
        if (res) {
          deleted.push({ id: key });
        }
      } catch (err) {
        throw err;
      }
    }

    return deleted;
  }
}
