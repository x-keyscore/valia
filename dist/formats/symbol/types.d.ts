import { TemplateCriteria, TemplateContext } from "../types";
export interface SymbolCriteria extends TemplateCriteria {
    type: "symbol";
}
type SymbolGuard = symbol;
export type SymbolContext = TemplateContext<SymbolCriteria, SymbolGuard, {}, {}>;
export {};
