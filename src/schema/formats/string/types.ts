import type { SetableCriteriaTemplate, SpecTypesTemplate, FlowTypesTemplate } from "../types";
import { testers } from "../../../testers";

type ExtractParams<T extends (input: any, params: any) => any> = 
	T extends (input: any, params: infer U) => any ? U : never;

type StringTesters = typeof testers.string;

type Testers = {
	[K in keyof StringTesters]: {
		name: K;
		params?: ExtractParams<StringTesters[K]>;
	};
}[keyof StringTesters];

export interface StringSetableCriteria extends SetableCriteriaTemplate<"string"> {
	/** @default true */
	empty?: boolean;
	min?: number;
	max?: number;
	enum?: string[] | Record<string | number, string>;
	regex?: RegExp;
	tester?: Testers;
	custom?: (value: string) => boolean;
}

export interface StringDefaultCriteria {
	empty: boolean;
}

export interface StringSpecTypes extends SpecTypesTemplate<
	StringSetableCriteria,
	StringDefaultCriteria
> {}

type StringGuardedCriteria<T extends StringSetableCriteria> =
	T['enum'] extends string[]
		? T['empty'] extends true
			? T['enum'][number] | ""
			: T['enum'][number]
		: T['enum'] extends Record<string | number, string>
			? T['empty'] extends true
				? { [K in keyof T['enum']]: T['enum'][K] }[keyof T['enum']] | ""
				: { [K in keyof T['enum']]: T['enum'][K] }[keyof T['enum']]
			: string;

export interface StringFlowTypes<T extends StringSetableCriteria> extends FlowTypesTemplate<
	{},
	StringGuardedCriteria<T>
> {}
