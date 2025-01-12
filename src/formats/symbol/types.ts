import { TemplateCriteria, TemplateConcretTypes, TemplateGenericTypes, FormatsCriteria } from "../types";

export interface SymbolCriteria extends TemplateCriteria<"symbol"> {}

export interface SymbolConcretTypes extends TemplateConcretTypes<
	SymbolCriteria,
	{},
	{}
> {}

type SymbolGuard<T extends FormatsCriteria> = T extends SymbolCriteria
	? symbol
	: never;

export interface SymbolGenericTypes<T extends FormatsCriteria> extends TemplateGenericTypes<
	SymbolCriteria,
	SymbolGuard<T>
> {}