import * as objectTesters from './object';
import * as stringTesters from './string';

export type * from "./types";
export * from './object';
export * from './string';

export const testers = {
	object: objectTesters,
	string: stringTesters
};