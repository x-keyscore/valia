import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

export interface NullSetableCriteria extends SetableCriteriaTemplate<"null"> {}

export interface NullDerivedCriteria extends DerivedCriteriaTemplate<
	{},
	null
> {}

export type NullRejectionCodes = 
	| "TYPE_NULL_UNSATISFIED";
