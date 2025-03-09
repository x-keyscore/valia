export type LooseAutocomplete<T extends string> = T | Omit<string, T>;

export type Constructor<T = any> = new (...args: any[]) => T;