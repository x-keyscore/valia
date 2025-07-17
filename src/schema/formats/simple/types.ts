import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

interface Simples {
	UNKNOWN: unknown;
	NULL: null;
	UNDEFINED: undefined;
	NULLISH: undefined | null;
}

export interface SimpleSetableCriteria extends SetableCriteriaTemplate<"simple"> {
	simple: keyof Simples;
}

export interface SimpleMountedCriteria {
	bitcode: number;
}

export interface SimpleDerivedCriteria<T extends SimpleSetableCriteria> extends DerivedCriteriaTemplate<
	SimpleMountedCriteria,
	Simples[T['simple']]
> {}

export type SimpleErrorCodes =
    | "SIMPLE_PROPERTY_REQUIRED"
    | "SIMPLE_PROPERTY_MALFORMED"
	| "SIMPLE_PROPERTY_STRING_MISCONFIGURED";

export type SimpleRejectCodes =
	| "SIMPLE_NULLISH_UNSATISFIED"
	| "SIMPLE_NULL_UNSATISFIED"
	| "SIMPLE_UNDEFINED_UNSATISFIED";

export interface SimpleCustomMembers {
	bitflags: Record<keyof Simples, number>
}