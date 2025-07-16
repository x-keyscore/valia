import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

export interface SymbolSetableCriteria extends SetableCriteriaTemplate<"symbol"> {
	literal?: symbol;
}

export interface SymbolDerivedCriteria extends DerivedCriteriaTemplate<
	{},
	symbol
> {}

export type SymbolErrorCodes =
	| "LITERAL_PROPERTY_MALFORMED";

export type SymbolRejectCodes =
	| "TYPE_SYMBOL_UNSATISFIED"
	| "LITERAL_UNSATISFIED";
