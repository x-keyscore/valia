import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";
import { testers } from "../../../testers";

type StringTesters = typeof testers.string;

type SetableConstraintOptions<K extends keyof StringTesters> = 
	StringTesters[K] extends (input: any, params: infer U) => any ? U : never;

export type SetableConstraint = {
	[K in keyof StringTesters]?: boolean | SetableConstraintOptions<K>;
}

type SetableLiteral = string | string[] | Record<string | number, string>;

export interface StringSetableCriteria extends SetableCriteriaTemplate<"string"> {
	min?: number;
	max?: number;
	regex?: RegExp;
	literal?: SetableLiteral;
	constraint?: SetableConstraint;
	custom?: (value: string) => boolean;
}

export interface StringMountedCriteria {
	resolvedLiteral?: Set<string>;
	resolvedConstraint?: Map<string, object | undefined>;
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

export type StringExceptionCodes =
    | "MIN_PROPERTY_MISDECLARED"
    | "MAX_PROPERTY_MISDECLARED"
    | "MIN_MAX_PROPERTIES_MISCONFIGURED"
	| "REGEX_PROPERTY_MISDECLARED"
    | "LITERAL_PROPERTY_MISDECLARED"
	| "LITERAL_PROPERTY_ARRAY_MISCONFIGURED"
    | "LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED"
	| "LITERAL_PROPERTY_OBJECT_MISCONFIGURED"
	| "LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED"
    | "LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED"
    | "CONSTRAINT_PROPERTY_MISDECLARED"
	| "CONSTRAINT_PROPERTY_OBJECT_MISCONFIGURED"
    | "CONSTRAINT_PROPERTY_OBJECT_KEY_MISDECLARED"
	| "CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED"
    | "CONSTRAINT_PROPERTY_OBJECT_VALUE_MISDECLARED"
    | "CUSTOM_PROPERTY_MISDECLARED";

export type StringRejectionCodes =
	| "TYPE_STRING_UNSATISFIED"
	| "MIN_UNSATISFIED"
	| "MAX_UNSATISFIED"
	| "REGEX_UNSATISFIED"
	| "LITERAL_UNSATISFIED"
	| "CONSTRAINT_UNSATISFIED"
	| "CUSTOM_UNSATISFIED";
