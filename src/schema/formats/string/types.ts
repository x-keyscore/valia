import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";
import { testers } from "../../../testers";

type StringTesters = typeof testers.string;

type SetableTestersParams<T extends (input: any, params: any) => any> = 
	T extends (input: any, params: infer U) => any ? U : never;

export type SetableTesters = {
	[K in keyof StringTesters]?: SetableTestersParams<StringTesters[K]> | boolean;
}

export interface StringSetableCriteria extends SetableTesters, SetableCriteriaTemplate<"string"> {
	/** @default true */
	empty?: boolean;
	min?: number;
	max?: number;
	enum?: string[] | Record<string | number, string>;
	regex?: string | RegExp;
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
	regex?: RegExp;
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

export interface StringDerivedCriteria<T extends StringSetableCriteria> extends DerivedCriteriaTemplate<
	StringMountedCriteria<T>,
	StringGuardedCriteria<T>
> {}

export type StringErrors =
    | "EMPTY_PROPERTY_MALFORMED"
    | "MIN_PROPERTY_MALFORMED"
    | "MAX_PROPERTY_MALFORMED"
    | "MIN_MAX_PROPERTIES_MISCONFIGURED"
    | "ENUM_PROPERTY_MALFORMED"
    | "ENUM_PROPERTY_ARRAY_ITEM_MALFORMED"
	| "ENUM_PROPERTY_OBJECT_KEY_MALFORMED"
    | "ENUM_PROPERTY_OBJECT_VALUE_MALFORMED"
    | "REGEX_PROPERTY_MALFORMED"
    | "TESTERS_PROPERTY_MALFORMED"
    | "TESTERS_PROPERTY_OBJECT_KEY_MALFORMED"
    | "TESTERS_PROPERTY_OBJECT_VALUE_MALFORMED"
    | "CUSTOM_PROPERTY_MALFORMED";

export type StringRejects =
	| "TYPE_STRING_UNSATISFIED"
	| "EMPTY_UNALLOWED"
	| "MIN_UNSATISFIED"
	| "MAX_UNSATISFIED"
	| "ENUM_UNSATISFIED"
	| "REGEX_UNSATISFIED"
	| "TESTERS_UNSATISFIED"
	| "CUSTOM_UNSATISFIED";

export interface StringMembers {
	mountTesters:
		(definedTesters: Record<string | symbol, unknown>) => StringErrors | null;
	checkTesters:
	(definedTesters: Record<string, {} | undefined | boolean>, value: string) => StringRejects | null;
}
