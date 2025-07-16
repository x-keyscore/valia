import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

export interface BooleanSetableCriteria extends SetableCriteriaTemplate<"boolean"> {
	literal: boolean;
}

export interface BooleanDerivedCriteria extends DerivedCriteriaTemplate<
	{},
	boolean
> {}

export type BooleanErrorCodes =
	| "LITERAL_PROPERTY_MALFORMED";

export type BooleanRejectCodes = 
	| "TYPE_BOOLEAN_UNSATISFIED"
	| "LITERAL_UNSATISFIED";
