import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

interface SimpleMap {
	NULL: null;
	UNDEFINED: undefined;
	NULLISH: undefined | null;
}

export interface SimpleSetableCriteria extends SetableCriteriaTemplate<"simple"> {
	simple: keyof SimpleMap;
}

export interface SimpleDerivedCriteria<T extends SimpleSetableCriteria> extends DerivedCriteriaTemplate<
	{},
	SimpleMap[T['simple']]
> {}

export type SimpleExceptionCodes =
    | "SIMPLE_PROPERTY_REQUIRED"
    | "SIMPLE_PROPERTY_MALFORMED"
	| "SIMPLE_PROPERTY_STRING_MISCONFIGURED";

export type SimpleRejectionCodes =
	| "SIMPLE_NULLISH_UNSATISFIED"
	| "SIMPLE_NULL_UNSATISFIED"
	| "SIMPLE_UNDEFINED_UNSATISFIED";

export interface SimpleCustomMembers {
	flags: (keyof SimpleMap)[];
}