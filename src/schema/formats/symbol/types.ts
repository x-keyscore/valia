import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

export interface SymbolSetableCriteria extends SetableCriteriaTemplate<"symbol"> {
	symbol?: symbol;
}

export interface SymbolDerivedCriteria extends DerivedCriteriaTemplate<
	{},
	symbol
> {}

export type SymbolErrors =
	| "SYMBOL_PROPERTY_MALFORMED";

export type SymbolRejects =
	| "TYPE_SYMBOL_UNSATISFIED"
	| "SYMBOL_UNSATISFIED";
