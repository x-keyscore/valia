import * as string from './string';
import * as primitive from './primitive';
import * as object from './object';
import { hasTag } from './utils';
export type * from "./types";
export * from './string';
export * from './primitive';
export * from './object';
export declare const testers: {
    hasTag: typeof hasTag;
    string: typeof string;
    primitive: typeof primitive;
    object: typeof object;
};
