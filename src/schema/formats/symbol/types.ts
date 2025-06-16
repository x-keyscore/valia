import type { SetableCriteriaTemplate, FlowTypesTemplate } from "../types";

export interface SymbolSetableCriteria extends SetableCriteriaTemplate<"symbol"> {
	symbol?: symbol;
}

export interface SymbolFlowTypes extends FlowTypesTemplate<
	{},
	symbol
> {}