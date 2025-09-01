import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";

type SetableLiteral = symbol | symbol[] | Record<string | number, symbol>;

export interface SymbolSetableCriteria extends SetableCriteriaTemplate<"symbol"> {
	literal?: SetableLiteral;
	custom?: (value: symbol) => boolean;
}

export interface SymbolMountedCriteria {
	resolvedLiteral?: Set<symbol>;
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

export type SymbolExceptionCodes =
	| "LITERAL_PROPERTY_MISDECLARED"
	| "LITERAL_PROPERTY_ARRAY_MISCONFIGURED"
    | "LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED"
	| "LITERAL_PROPERTY_OBJECT_MISCONFIGURED"
	| "LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED"
    | "LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED"
	| "CUSTOM_PROPERTY_MISDECLARED";

export type SymbolRejectionCodes =
	| "TYPE_SYMBOL_UNSATISFIED"
	| "LITERAL_UNSATISFIED"
	| "CUSTOM_UNSATISFIED";
