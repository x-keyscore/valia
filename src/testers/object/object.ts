import type { PlainObject, PlainFunction, AsyncFunction } from "../types";
import { getInternalTag } from "../../helpers";

// OBJECT
export function isObject(x: unknown): x is object {
	return (typeof x === "object");
}

/**
 * A plain object is considered as follows:
 * - It must be an object.
 * - It must have a prototype of `Object.prototype` or `null`.
*/
export function isPlainObject(x: unknown): x is PlainObject {
	if (x === null || typeof x !== "object") return (false);
	const prototype = Object.getPrototypeOf(x);
	if (prototype !== Object.prototype && prototype !== null) {
		return (false);
	}
    return (true);
}

// ARRAY
export function isArray(x: unknown): x is unknown[] {
	return (Array.isArray(x));
}

export function isTypedArray(x: unknown): x is unknown[] {
	return (ArrayBuffer.isView(x) && !(x instanceof DataView));
}

// FUNCTION
export function isFunction(x: unknown): x is Function {
	return (typeof x === "function");
}

/**
 * A basic function is considered as follows:
 * - It must be an function.
 * - It must not be an `async`, `generator` or `async generator` function.
*/
export function isBasicFunction(x: unknown): x is PlainFunction {
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