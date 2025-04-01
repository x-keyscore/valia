export type PlainObject = Record<string | symbol, unknown>;
export type PlainFunction = (...args: unknown[]) => unknown;
export type AsyncFunction = (...args: unknown[]) => Promise<unknown>;
