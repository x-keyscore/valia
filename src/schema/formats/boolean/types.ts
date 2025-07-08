import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

export interface BooleanSetableCriteria extends SetableCriteriaTemplate<"boolean"> {}

export interface BooleanDerivedCriteria extends DerivedCriteriaTemplate<
	{},
	boolean
> {}

export type BooleanRejects = 
	| "TYPE_BOOLEAN_UNSATISFIED";
