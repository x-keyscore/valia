import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

type SetableLiteral = number | number[] | Record<string | number, number>;

export interface NumberSetableCriteria extends SetableCriteriaTemplate<"number"> {
	min?: number;
	max?: number;
	literal?: SetableLiteral;
	custom?: (value: number) => boolean;
}

export interface NumberMountedCriteria {
	resolvedLiteral?: Set<number>;
}

type NumberGuardedCriteria<T extends NumberSetableCriteria> = 
	T['literal'] extends Record<string | number, number>
		? T['literal'][keyof T['literal']]
		: T["literal"] extends number[]
			? T['literal'][number]
			: T['literal'] extends number
				? T["literal"]
				: number;

export interface NumberDerivedCriteria<T extends NumberSetableCriteria> extends DerivedCriteriaTemplate<
	NumberMountedCriteria,
	NumberGuardedCriteria<T>
> {}

export type NumberExceptionCodes =
	| "MIN_PROPERTY_MISDECLARED"
    | "MAX_PROPERTY_MISDECLARED"
    | "MIN_MAX_PROPERTIES_MISCONFIGURED"
    | "LITERAL_PROPERTY_MISDECLARED"
	| "LITERAL_PROPERTY_ARRAY_MISCONFIGURED"
    | "LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED"
	| "LITERAL_PROPERTY_OBJECT_MISCONFIGURED"
	| "LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED"
    | "LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED"
    | "CUSTOM_PROPERTY_MISDECLARED";

export type NumberRejectionCodes =
	| "TYPE_NUMBER_UNSATISFIED"
	| "MIN_UNSATISFIED"
	| "MAX_UNSATISFIED"
	| "LITERAL_UNSATISFIED"
	| "CUSTOM_UNSATISFIED";
