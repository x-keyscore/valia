export * as strings from './strings';
export {
	isDomain,
	isPhone,
	isAscii,
	isEmail,
	isAlpha,
	isDigit,
	isIp
} from "./strings";

export * as primitives from './primitives';
export {
	isBoolean,
	isString,
	isNumber,
	isBigint,
	isSymbol,
	isUndefined,
	isNull,
} from "./primitives";

export * as objects from './objects';
export  {
	isObject,
	isPlainObject,
	isArray,
	isPlainFunction,
	isAsyncFunction,
	isGeneratorFunction,
	isAsyncGeneratorFunction,
	isGenerator,
	isAsyncGenerator
} from "./objects";

export * as tools from './tools';
export { hasTag } from "./tools";

export type * as types from './types';
export type {
	PrimitiveTypes,
	StandardTags,
	PlainObject,
	PlainFunction,
	AsyncFunction
} from "./types";
