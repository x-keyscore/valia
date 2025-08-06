import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

export interface UnknownSetableCriteria extends SetableCriteriaTemplate<"unknown"> {}

export interface UnknownDerivedCriteria extends DerivedCriteriaTemplate<
	{},
	unknown
> {}

export interface NullSetableCriteria extends SetableCriteriaTemplate<"null"> {}

export interface NullDerivedCriteria extends DerivedCriteriaTemplate<
	{},
	null
> {}

export type NullRejectionCodes = "TYPE_NULL_UNSATISFIED";

export interface UndefinedSetableCriteria extends SetableCriteriaTemplate<"undefined"> {}

export interface UndefinedDerivedCriteria extends DerivedCriteriaTemplate<
	{},
	undefined
> {}

export type UndefinedRejectionCodes = "TYPE_UNDEFINED_UNSATISFIED";