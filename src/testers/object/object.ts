import type { BasicObject, PlainObject, BasicArray, TypedArray, BasicFunction, AsyncFunction } from "../types";
import { getInternalTag } from "../../helpers";
import { isFloat32Array } from "util/types";

// OBJECT
export function isObject(x: unknown): x is BasicObject {
	return (x !== null && typeof x === "object");
}

/**
 * A plain object is considered as follows:
 * - It must be an object.
 * - It must have a prototype of `Object.prototype` or `null`.
*/
export function isPlainObject(x: unknown): x is PlainObject {
	if (x === null || typeof x !== "object") return (false);
	const prototype = Object.getPrototypeOf(x);

    return (prototype === null || prototype === Object.prototype);
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