import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

export interface UndefinedSetableCriteria extends SetableCriteriaTemplate<"undefined"> {}

export interface UndefinedDerivedCriteria extends DerivedCriteriaTemplate<
	{},
	null
> {}

export type UndefinedRejectionCodes =
	| "TYPE_UNDEFINED_UNSATISFIED";
