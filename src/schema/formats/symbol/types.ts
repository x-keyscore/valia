import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

type SetableLiteral = symbol | symbol[] | Record<string | number, symbol>;

export interface SymbolSetableCriteria extends SetableCriteriaTemplate<"symbol"> {
	literal?: SetableLiteral;
}

export interface SymbolMountedCriteria {
	literalSet?: Set<symbol>;
}

type SymbolGuardedCriteria<T extends SymbolSetableCriteria> = 
	T['literal'] extends Record<string | number, symbol>
		? T['literal'][keyof T['literal']]
		: T["literal"] extends symbol[]
			? T['literal'][number]
			: T['literal'] extends symbol
				? T["literal"]
				: symbol;

export interface SymbolDerivedCriteria<T extends SymbolSetableCriteria> extends DerivedCriteriaTemplate<
	SymbolMountedCriteria,
	SymbolGuardedCriteria<T>
> {}

export type SymbolErrorCodes =
	| "LITERAL_PROPERTY_MALFORMED"
	| "LITERAL_PROPERTY_ARRAY_MISCONFIGURED"
    | "LITERAL_PROPERTY_ARRAY_ITEM_MALFORMED"
	| "LITERAL_PROPERTY_OBJECT_MISCONFIGURED"
	| "LITERAL_PROPERTY_OBJECT_KEY_MALFORMED"
    | "LITERAL_PROPERTY_OBJECT_VALUE_MALFORMED";

export type SymbolRejectCodes =
	| "TYPE_SYMBOL_UNSATISFIED"
	| "LITERAL_UNSATISFIED";
