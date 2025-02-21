import type { SetableCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate } from "../types";
export interface SymbolSetableCriteria extends SetableCriteriaTemplate<"symbol"> {
    symbol?: symbol;
}
export interface SymbolConcreteTypes extends ConcreteTypesTemplate<SymbolSetableCriteria, {}> {
}
type SymbolGuardedCriteria = symbol;
export interface SymbolGenericTypes<T extends SymbolSetableCriteria> extends GenericTypesTemplate<SymbolSetableCriteria, {}, SymbolGuardedCriteria> {
}
export {};
