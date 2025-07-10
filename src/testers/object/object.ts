import type { BasicObject, PlainObject, BasicArray, TypedArray, BasicFunction, AsyncFunction } from "../types";
import { getInternalTag } from "../../helpers";

// OBJECT

export function isObject(x: null | undefined | number | bigint | string | boolean | symbol | object): x is object;
export function isObject(x: unknown): x is BasicObject;

export function isObject(x: unknown): x is BasicObject {
	return (x !== null && typeof x === "object");
}

export function isPlainObject(x: null | undefined | number | bigint | string | boolean | symbol | object): x is object;
export function isPlainObject(x: unknown): x is PlainObject;

/**
 * A plain object is considered as follows:
 * - It must not be null.
 * - It must be an object.
 * - It must have a prototype of `Object.prototype` or `null`.
*/
export function isPlainObject(x: unknown): x is PlainObject {
	if (x === null || typeof x !== "object") return (false);
	const prototype = Object.getPrototypeOf(x);

    return (prototype === null || prototype === Object.prototype);
}

/**
 * An object-like value is considered as follows:
 * - It must not be `null`.
 * - It must be of `object` or `function` type.
 */
export function isObjectLike(x: unknown): x is object {
  return ((x !== null && typeof x === "object") || typeof x === "function");
}

// ARRAY
export function isArray(x: unknown): x is BasicArray {
	return (Array.isArray(x));
}

/**
 * A typed array is considered as follows:
 * - It must be a view on an ArrayBuffer.
 * - It must not be a `DataView`.
 */
export function isTypedArray(x: unknown): x is TypedArray {
	return (ArrayBuffer.isView(x) && !(x instanceof DataView));
}

/**
 * An array-like value is considered as follows:
 * - It must not be `null` or `undefined`.
 * - It must be of `object` or `function` type.
 * - It must have a numeric `length` property.
 */
export function isArrayLike(x: unknown): x is ArrayLike<unknown> {
  return (
    x != null && (typeof x === "object" || typeof x === "function") &&
	("length" in x) && (typeof x.length === "number") && x.length >= 0
  );
}

// FUNCTION
export function isFunction(x: unknown): x is BasicFunction {
	return (getInternalTag(x) === "Function");
}

export function isAsyncFunction(x: unknown): x is AsyncFunction {
	return (getInternalTag(x) === "AsyncFunction");
}

export function isGeneratorFunction(x: unknown): x is GeneratorFunction {
	return (getInternalTag(x) === "GeneratorFunction");
}

export function isAsyncGeneratorFunction(x: unknown): x is AsyncGeneratorFunction {
	return (getInternalTag(x) === "AsyncGeneratorFunction");
}