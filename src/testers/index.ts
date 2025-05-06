import * as stringTests from './string';
import * as objectTests from './object';

export type * from "./types";
export * from './string';
export * from './object';

export const testers = {
	object: objectTests,
	string: stringTests
};