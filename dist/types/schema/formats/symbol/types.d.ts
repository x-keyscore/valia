import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate } from "../types";
export interface SymbolSetableCriteria extends SetableCriteriaTemplate<"symbol"> {
    symbol?: symbol;
}
export interface SymbolClassicTypes extends ClassicTypesTemplate<SymbolSetableCriteria, {}> {
}
export interface SymbolGenericTypes extends GenericTypesTemplate<{}, symbol> {
}
