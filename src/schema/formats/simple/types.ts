import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

interface VariantMap {
	UNKNOWN: unknown;
	NULL: null;
	UNDEFINED: undefined;
	NULLISH: undefined | null;
}

export interface SimpleSetableCriteria extends SetableCriteriaTemplate<"simple"> {
	variant: keyof VariantMap;
}

export interface SimpleMountedCriteria {
	variantBitcode: number;
}

export interface SimpleDerivedCriteria<T extends SimpleSetableCriteria> extends DerivedCriteriaTemplate<
	SimpleMountedCriteria,
	VariantMap[T['variant']]
> {}

export type SimpleErrorCodes =
    | "VARIANT_PROPERTY_REQUIRED"
    | "VARIANT_PROPERTY_MALFORMED"
	| "VARIANT_PROPERTY_STRING_MISCONFIGURED";

export type SimpleRejectCodes =
	| "VARIANT_NULLISH_UNSATISFIED"
	| "VARIANT_NULL_UNSATISFIED"
	| "VARIANT_UNDEFINED_UNSATISFIED";

export interface SimpleCustomMembers {
	variantBitflags: Record<keyof VariantMap, number>
}