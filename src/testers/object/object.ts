import type { PlainObject, PlainFunction, AsyncFunction } from "../types";
import { hasTag } from "../utils";

// OBJECT
export function isObject(x: unknown): x is object {
	return typeof x === "object";
}

export function isPlainObject(x: unknown): x is PlainObject {
	return hasTag(x, "Object");
}

// ARRAY
export function isArray(x: unknown): x is unknown[] {
	return Array.isArray(x);
}

// FUNCTION
export function isPlainFunction(x: unknown): x is PlainFunction {
	return hasTag(x, "Function");
}

export function isAsyncFunction(x: unknown): x is AsyncFunction {
	return hasTag(x, "AsyncFunction");
}

export function isGeneratorFunction(x: unknown): x is GeneratorFunction {
	return hasTag(x, "GeneratorFunction");
}

export function isAsyncGeneratorFunction(x: unknown): x is AsyncGeneratorFunction {
	return hasTag(x, "AsyncGeneratorFunction");
}

// GENERATOR
export function isGenerator(x: unknown): x is Generator {
    return hasTag(x, "Generator");
}

export function isAsyncGenerator(x: unknown): x is AsyncGenerator {
    return hasTag(x, "AsyncGenerator");
}

// OTHER
export function isRegExp(x: unknown): x is RegExp {
	return hasTag(x, "RegExp");
}