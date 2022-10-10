export class MemoryCache<T extends Record<string, any>> {
  protected data: Partial<T> & Record<string, any> = {};

  public set(key: keyof T, value: T[typeof key]): void;
  public set(key: string, value: any): void {
    this.data[key as keyof T] = value;
  }

  public async get<K extends keyof T, K2 extends keyof T[K]>(
    key: [K, K2],
    valueProvider: () => Promise<T[K][K2]>
  ): Promise<T[K][K2]>;
  public async get<K extends keyof T>(
    key: K,
    valueProvider: () => Promise<T[K]>
  ): Promise<T[K]>;
  public async get<R>(
    key: string | string[],
    valueProvider: () => Promise<R>
  ): Promise<R> {
    if (Array.isArray(key)) {
      let cur: any = this.data;
      for (const k of key.slice(0, key.length - 1)) {
        cur = cur[k];
      }
      const lastKeySegment = key[key.length - 1];
      return (
        cur[lastKeySegment] ?? (cur[lastKeySegment] = await valueProvider())
      );
    }
    return (
      this.data[key] ??
      (this.data[key as keyof T | string] = await valueProvider())
    );
  }
}
