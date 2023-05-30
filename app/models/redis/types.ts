export type Cache = {
  id?: string;
};

// ICache Define a interface used by cache adapter class implementation.
export interface ICache {
  deleteBatch(keys: string[]): Promise<Cache[]>;
  flush(): Promise<boolean>;
  connect(): Promise<void>;
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T | T[]): Promise<void>;
  getBatch<T>(keys: string[]): Promise<T[]>;
  setBatch<T extends Cache>(data: T[]): Promise<void>;
  del(key: string): Promise<boolean>;
  flush(): Promise<boolean>;
  keys(pattern: string): Promise<string[]>;
}
