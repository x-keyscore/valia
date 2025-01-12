import { FormatsCriteria, GlobalCriteria } from "../types";

type FormatName = "symbol";

export interface SymbolCriteria extends GlobalCriteria {
	type: FormatName;
}

export type SymbolConcretTypes = {
	type: FormatName;
	criteria: SymbolCriteria;
	defaultCriteria: {};
	mountedCritetia: {};
}

type SymbolGuard<T extends FormatsCriteria> = T extends SymbolCriteria
	? symbol
	: never;

export type SymbolGenericTypes<T extends FormatsCriteria> = {
	type: FormatName;
	guard: SymbolGuard<T>;
}