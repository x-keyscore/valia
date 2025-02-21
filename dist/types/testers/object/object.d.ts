import type { PlainObject, PlainFunction, AsyncFunction } from "../types";
export declare function isObject(x: unknown): x is object;
/**
 * A plain object is considered as follows:
 * - It must be an object.
 * - It must have a prototype of `Object.prototype` or `null`.
 * - It must only have keys of type `string` or `symbol`.
*/
export declare function isPlainObject(x: unknown): x is PlainObject;
/**
 * A basic object is considered as follows:
 * - It must be an object.
 * - It must have a prototype of `Object.prototype` or `null`.
*/
export declare function isBasicObject(x: unknown): x is PlainObject;
export declare function isArray(x: unknown): x is unknown[];
export declare function isFunction(x: unknown): x is Function;
export declare function isBasicFunction(x: unknown): x is PlainFunction;
export declare function isAsyncFunction(x: unknown): x is AsyncFunction;
export declare function isGeneratorFunction(x: unknown): x is GeneratorFunction;
export declare function isAsyncGeneratorFunction(x: unknown): x is AsyncGeneratorFunction;
