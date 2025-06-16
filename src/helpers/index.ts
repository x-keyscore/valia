import * as objectHelpers from './object';
import * as stringHelpers from './string';

export type * from "./types";
export * from './object';
export * from './string';

export const helpers = {
	object: objectHelpers,
	string: stringHelpers
};