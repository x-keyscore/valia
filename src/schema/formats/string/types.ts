import type { SetableCriteriaTemplate, FlowTypesTemplate } from "../types";
import { testers } from "../../../testers";

type ExtractParams<T extends (input: any, params: any) => any> = 
	T extends (input: any, params: infer U) => any ? U : never;

type StringTesters = typeof testers.string;

export type SetableTesters = {
	[K in keyof StringTesters]: ExtractParams<StringTesters[K]> | true;
}

export interface StringSetableCriteria extends SetableCriteriaTemplate<"string"> {
	/** @default true */
	empty?: boolean;
	min?: number;
	max?: number;
	enum?: string[] | Record<string | number, string>;
	regex?: RegExp;
	testers?: SetableTesters;
	custom?: (value: string) => boolean;
}

export interface StringMountedCriteria<T extends StringSetableCriteria> {
	empty:
		unknown extends T['empty']
			? true
			: StringSetableCriteria['empty'] extends T['empty']
				? boolean
				: T['empty'];
}

type EnumValues<T extends StringSetableCriteria> =
	T['enum'] extends Record<string | number, string>
		? T['enum'][keyof T['enum']]
		: T['enum'] extends string[]
			? T['enum'][number]
			: never;

type StringGuardedCriteria<T extends StringSetableCriteria> =
	T['enum'] extends (string[] | Record<string | number, string>)
		? (EnumValues<T> | (T['empty'] extends true ? "" : never))
		: string;

export interface StringFlowTypes<T extends StringSetableCriteria> extends FlowTypesTemplate<
	StringMountedCriteria<T>,
	StringGuardedCriteria<T>
> {}
