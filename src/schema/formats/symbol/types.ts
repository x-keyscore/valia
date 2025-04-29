import type { SetableCriteriaTemplate, SpecTypesTemplate, FlowTypesTemplate } from "../types";

export interface SymbolSetableCriteria extends SetableCriteriaTemplate<"symbol"> {
	symbol?: symbol;
}

export interface SymbolSpecTypes extends SpecTypesTemplate<
	SymbolSetableCriteria,
	{}
> {}

export interface SymbolFlowTypes extends FlowTypesTemplate<
	{},
	symbol
> {}