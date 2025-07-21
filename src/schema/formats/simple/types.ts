import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

interface NatureMap {
	UNKNOWN: unknown;
	NULL: null;
	UNDEFINED: undefined;
	NULLISH: undefined | null;
}

export interface SimpleSetableCriteria extends SetableCriteriaTemplate<"simple"> {
	nature: keyof NatureMap;
}

export interface SimpleMountedCriteria {
	natureBitcode: number;
}

export interface SimpleDerivedCriteria<T extends SimpleSetableCriteria> extends DerivedCriteriaTemplate<
	SimpleMountedCriteria,
	NatureMap[T['nature']]
> {}

export type SimpleExceptionCodes =
    | "NATURE_PROPERTY_REQUIRED"
    | "NATURE_PROPERTY_MALFORMED"
	| "NATURE_PROPERTY_STRING_MISCONFIGURED";

export type SimpleRejectionCodes =
	| "NATURE_NULLISH_UNSATISFIED"
	| "NATURE_NULL_UNSATISFIED"
	| "NATURE_UNDEFINED_UNSATISFIED";

export interface SimpleCustomMembers {
	natureBitflags: Record<keyof NatureMap, number>
}