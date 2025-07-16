import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";
import { testers } from "../../../testers";

type StringTesters = typeof testers.string;

type SetableConstraintParams<T extends (input: any, params: any) => any> = 
	T extends (input: any, params: infer U) => any ? U : never;

export type SetableConstraint = {
	[K in keyof StringTesters]?: true | SetableConstraintParams<StringTesters[K]>;
}

type SetableLiteral = string | string[] | Record<string | number, string>;

export interface StringSetableCriteria extends SetableCriteriaTemplate<"string"> {
	min?: number;
	max?: number;
	regex?: string | RegExp;
	literal?: SetableLiteral;
	constraint?: SetableConstraint;
	custom?: (value: string) => boolean;
}

export interface StringMountedCriteria {
	regex?: RegExp;
}

type StringGuardedCriteria<T extends StringSetableCriteria> =
	T['literal'] extends Record<string | number, string>
		? T['literal'][keyof T['literal']]
		: T["literal"] extends string[]
			? T['literal'][number]
			: T['literal'] extends string
				? T["literal"]
				: string;

export interface StringDerivedCriteria<T extends StringSetableCriteria> extends DerivedCriteriaTemplate<
	StringMountedCriteria,
	StringGuardedCriteria<T>
> {}

export type StringErrorCodes =
    | "MIN_PROPERTY_MALFORMED"
    | "MAX_PROPERTY_MALFORMED"
    | "MIN_MAX_PROPERTIES_MISCONFIGURED"
	| "REGEX_PROPERTY_MALFORMED"
    | "LITERAL_PROPERTY_MALFORMED"
	| "LITERAL_PROPERTY_ARRAY_MISCONFIGURED"
    | "LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED"
	| "LITERAL_PROPERTY_OBJECT_MISCONFIGURED"
	| "LITERAL_PROPERTY_OBJECT_KEY_MALFORMED"
    | "LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED"
    | "CONSTRAINT_PROPERTY_MALFORMED"
	| "CONSTRAINT_PROPERTY_MISCONFIGURED"
    | "CONSTRAINT_PROPERTY_OBJECT_KEY_MALFORMED"
	| "CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED"
    | "CONSTRAINT_PROPERTY_OBJECT_VALUE_MALFORMED"
    | "CUSTOM_PROPERTY_MALFORMED";

export type StringRejectCodes  =
	| "TYPE_STRING_UNSATISFIED"
	| "MIN_UNSATISFIED"
	| "MAX_UNSATISFIED"
	| "REGEX_UNSATISFIED"
	| "LITERAL_UNSATISFIED"
	| "CONSTRAINT_UNSATISFIED"
	| "CUSTOM_UNSATISFIED";

export interface StringCustomMembers {
	mountConstraint:
		(definedTesters: Record<string | symbol, unknown>) => StringErrorCodes | null;
	checkConstraint:
		(definedTesters: Record<string, {} | undefined | boolean>, value: string) => StringRejectCodes | null;
}
