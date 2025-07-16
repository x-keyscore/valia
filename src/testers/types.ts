export interface BasicObject { 
    [key: string | symbol | number]: unknown
};

export type PlainObject = {
    [key: string | symbol]: unknown
};

export interface BasicArray extends Array<unknown> {}

export interface TypedArray extends ArrayBufferView {
    [index: number]: number | bigint;
}

export type BasicFunction = (...args: any[]) => unknown;

export type AsyncFunction = (...args: any[]) => Promise<unknown>;