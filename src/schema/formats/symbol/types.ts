import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate } from "../types";

export interface SymbolSetableCriteria extends SetableCriteriaTemplate<"symbol"> {
	symbol?: symbol;
}

export interface SymbolClassicTypes extends ClassicTypesTemplate<
	SymbolSetableCriteria,
	{}
> {}

type SymbolGuardedCriteria = symbol;

export interface SymbolGenericTypes<T extends SymbolSetableCriteria> extends GenericTypesTemplate<
	{},
	SymbolGuardedCriteria
> {}