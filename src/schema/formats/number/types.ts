import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

export interface NumberSetableCriteria extends SetableCriteriaTemplate<"number"> {
	min?: number;
	max?: number;
	enum?: number[] | Record<string | number, number>;
	custom?: (input: number) => boolean;
}

type NumberGuardedCriteria<T extends NumberSetableCriteria> = 
	T['enum'] extends number[]
		? T['enum'][number]
		: T['enum'] extends Record<string | number, number>
			? T['enum'][keyof T['enum']]
			: number;

export interface NumberDerivedCriteria<T extends NumberSetableCriteria> extends DerivedCriteriaTemplate<
	{},
	NumberGuardedCriteria<T>
> {}

export type NumberErrors =
	| "MIN_PROPERTY_MALFORMED"
    | "MAX_PROPERTY_MALFORMED"
    | "MIN_AND_MAX_PROPERTIES_MISCONFIGURED"
    | "ENUM_PROPERTY_MALFORMED"
    | "ENUM_PROPERTY_ARRAY_ITEM_MALFORMED"
	| "ENUM_PROPERTY_OBJECT_KEY_MALFORMED"
    | "ENUM_PROPERTY_OBJECT_VALUE_MALFORMED"
    | "CUSTOM_PROPERTY_MALFORMED";

export type NumberRejects =
	| "TYPE_NUMBER_UNSATISFIED"
	| "MIN_UNSATISFIED"
	| "MAX_UNSATISFIED"
	| "ENUM_UNSATISFIED"
	| "CUSTOM_UNSATISFIED";
