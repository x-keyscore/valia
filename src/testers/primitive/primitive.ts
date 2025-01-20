export function isString(x: unknown): x is string {
	return typeof x === "string";
}

export function isBoolean(x: unknown): x is number {
	return typeof x === "boolean";
}

export function isNumber(x: unknown): x is number {
	return typeof x === "number";
}

export function isBigint(x: unknown): x is bigint {
	return typeof x === "bigint";
}

export function isSymbol(x: unknown): x is symbol {
	return typeof x === "symbol";
}

export function isUndefined(x: unknown): x is undefined {
	return x === undefined;
}

export function isNull(x: unknown): x is null {
	return x === null;
}
//export const primitive = { isString, isBoolean, isNumber, isBigint, isSymbol, isUndefined, isNull };