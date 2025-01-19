import { VariantCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, VariantCriteria } from "../types";

export interface SymbolVariantCriteria extends VariantCriteriaTemplate<"symbol"> {
	symbol?: symbol;
}

export interface SymbolConcreteTypes extends ConcreteTypesTemplate<
	SymbolVariantCriteria,
	{},
	{}
> {}

type SymbolGuard<T extends VariantCriteria> = T extends SymbolVariantCriteria ? symbol : never;

export interface SymbolGenericTypes<T extends VariantCriteria> extends GenericTypesTemplate<
	SymbolVariantCriteria,
	SymbolGuard<T>
> {}