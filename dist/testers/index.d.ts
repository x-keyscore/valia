import * as string from './string';
import * as primitive from './primitive';
import * as object from './object';
import { hasTag } from './utils';
export type * from "./types";
export * from './string';
export * from './primitive';
export * from './object';
export declare const testers: {
    primitive: typeof primitive;
    object: typeof object;
    string: typeof string;
    hasTag: typeof hasTag;
};
