import * as stringTests from './string';
import * as objectTests from './object';

export type * from "./types";
export * from './string';
export * from './object';

export const tests = {
	object: objectTests,
	string: stringTests
};