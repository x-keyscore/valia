<<<<<<< HEAD
import * as objectTesters from './object';
import * as stringTesters from './string';

export type * from "./types";
export * from './object';
export * from './string';

export const testers = {
	object: objectTesters,
	string: stringTesters
=======
import * as stringTests from './string';
import * as objectTests from './object';

export type * from "./types";
export * from './string';
export * from './object';

export const testers = {
	object: objectTests,
	string: stringTests
>>>>>>> 149b53cfcb46941fa9a61c16c4daabf1bad52060
};