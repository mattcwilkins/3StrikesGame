import { useState } from "react";

export class LocalStorage {
  public set<A>(key: string, value?: A) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
      localStorage.setItem(key, String(value));
    }
    return this.get<A>(key);
  }
  public get<A>(key: string, defaultValue?: A): A {
    try {
      return (
        (JSON.parse(localStorage.getItem(key) as any) as A) ??
        this.set<A>(key, defaultValue)
      );
    } catch (e) {
      console.error(e);
      return (localStorage.getItem(key) as A) ?? this.set<A>(key, defaultValue);
    }
  }
}

export const store = new LocalStorage();

export function useLocalStorage<A>(
  key: string,
  defaultValue?: A
): [A, (a: A) => void] {
  const [value, setValue] = useState<A>(store.get(key, defaultValue));
  return [
    value,
    (val: A) => {
      store.set(key, val);
      return setValue(val);
    },
  ];
}
