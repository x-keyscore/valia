import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

export interface UnknownSetableCriteria extends SetableCriteriaTemplate<"unknown"> {}

export interface UnknownDerivedCriteria extends DerivedCriteriaTemplate<
	{},
	unknown
> {}