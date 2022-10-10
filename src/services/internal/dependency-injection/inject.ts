export type Constructor<T> = {
  new (...args: any[]): T;
};

export const globalDi = new Map();

export function inject<T>(Ctor: Constructor<T>): T {
  if (!globalDi.has(Ctor)) {
    globalDi.set(Ctor, new Ctor());
  }
  return globalDi.get(Ctor);
}
