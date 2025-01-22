import * as string from './string';
import * as object from './object';
import { hasTag } from './utils';
export type * from "./types";
export * from './string';
export * from './object';
export declare const testers: {
    object: typeof object;
    string: typeof string;
    hasTag: typeof hasTag;
};
