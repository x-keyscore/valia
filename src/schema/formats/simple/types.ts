import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";
import type { BasicFunction, AsyncFunction } from "../../../testers";

export type SimpleTypes =
	| "null"
	| "undefined"
	| "nullish"
	| "unknown";

export interface SimpleSetableCriteria extends SetableCriteriaTemplate<"simple"> {
	simple: SimpleTypes;
}

export interface SimpleMountedCriteria {
	bitcode: number;
}

type SimpleGuardedCriteria<T extends SimpleSetableCriteria> =
	T["simple"] extends "null"      ? null :
	T["simple"] extends "undefined" ? undefined :
	T["simple"] extends "nullish"   ? undefined | null :
	T["simple"] extends "unknown"   ? unknown :
	never;

export interface SimpleDerivedCriteria<T extends SimpleSetableCriteria> extends DerivedCriteriaTemplate<
	SimpleMountedCriteria,
	SimpleGuardedCriteria<T>
> {}

export type SimpleErrors =
    | "SIMPLE_PROPERTY_REQUIRED"
    | "SIMPLE_PROPERTY_MALFORMED"
	| "SIMPLE_PROPERTY_STRING_MISCONFIGURED";

export type SimpleRejects =
	| "SIMPLE_NULLISH_UNSATISFIED"
	| "SIMPLE_NULL_UNSATISFIED"
	| "SIMPLE_UNDEFINED_UNSATISFIED"

export interface SimpleMembers {
	bitflags: Record<SimpleTypes, number>
}