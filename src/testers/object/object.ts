import type { PlainObject, PlainFunction, AsyncFunction } from "../types";
import { hasTag } from "../utils";

// OBJECT
export function isObject(x: unknown): x is object {
	return (typeof x === "object");
}

/**
 * A basic object is considered as follows:
 * - It must be an object.
 * - It must have a prototype of `Object.prototype` or `null`.
*/
export function isBasicObject(x: unknown): x is PlainObject {
	if (x === null || typeof x !== "object") return (false);
	const prototype = Object.getPrototypeOf(x);
	if (prototype === Object.prototype || prototype === null) {
		return (true);
	}
    return (false);
}

/**
 * A plain object is considered as follows:
 * - It must be an object.
 * - It must have a prototype of `Object.prototype` or `null`.
 * - It must only have keys of type `string` or `symbol`.
*/
export function isPlainObject(x: unknown): x is PlainObject {
	if (x === null || typeof x !== "object") return (false);
	const prototype = Object.getPrototypeOf(x);
	if (prototype !== Object.prototype && prototype !== null) {
		return (false);
	}
	const keys = Reflect.ownKeys(x);
    for (const key of keys) {
        if (typeof (x as any)[key] === "function") {
            return (false);
        }
    }
    return (true);
}

// ARRAY
export function isArray(x: unknown): x is unknown[] {
	return (Array.isArray(x));
}

// FUNCTION
export function isFunction(x: unknown): x is Function {
	return (typeof x === "function");
}

export function isBasicFunction(x: unknown): x is PlainFunction {
	return (hasTag(x, "Function"));
}

export function isAsyncFunction(x: unknown): x is AsyncFunction {
	return (hasTag(x, "AsyncFunction"));
}

export function isGeneratorFunction(x: unknown): x is GeneratorFunction {
	return (hasTag(x, "GeneratorFunction"));
}

export function isAsyncGeneratorFunction(x: unknown): x is AsyncGeneratorFunction {
	return (hasTag(x, "AsyncGeneratorFunction"));
}