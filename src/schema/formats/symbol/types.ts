import { TunableCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, TunableCriteria } from "../types";

export interface SymbolTunableCriteria extends TunableCriteriaTemplate<"symbol"> {
	symbol?: symbol;
}

export interface SymbolConcreteTypes extends ConcreteTypesTemplate<
	SymbolTunableCriteria,
	{}
> {}

type SymbolGuardedCriteria = symbol;

export interface SymbolGenericTypes<T extends SymbolTunableCriteria> extends GenericTypesTemplate<
	SymbolTunableCriteria,
	{},
	SymbolGuardedCriteria
> {}