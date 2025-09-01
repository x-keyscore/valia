import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

export interface BooleanSetableCriteria extends SetableCriteriaTemplate<"boolean"> {
	literal?: boolean;
}

export interface BooleanDerivedCriteria extends DerivedCriteriaTemplate<
	{},
	boolean
> {}

export type BooleanExceptionCodes =
	| "LITERAL_PROPERTY_MISDECLARED";

export type BooleanRejectionCodes = 
	| "TYPE_BOOLEAN_UNSATISFIED"
	| "LITERAL_UNSATISFIED";
