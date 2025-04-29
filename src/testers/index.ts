import * as stringTesters from './string';
import * as objectTesters from './object';

export type {
	PlainObject,
	PlainFunction,
	AsyncFunction
} from "./types";

export * from './string';
export * from './object';

export const testers = {
	object: objectTesters,
	string: stringTesters
};