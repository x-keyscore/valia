import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";
import type { BasicFunction, AsyncFunction } from "../../../testers";

interface NatureMap {
	BASIC: BasicFunction;
	ASYNC: AsyncFunction;
	BASIC_GENERATOR: GeneratorFunction;
	ASYNC_GENERATOR: AsyncGeneratorFunction;
}

export interface FunctionSetableCriteria extends SetableCriteriaTemplate<"function"> {
	nature?: keyof NatureMap | (keyof NatureMap)[];
}

export interface FunctionMountedCriteria {
	natureBitcode: number;
}

type FunctionGuardedCriteria<T extends FunctionSetableCriteria> =
	T['nature'] extends (keyof NatureMap)[]
		? NatureMap[T['nature'][number]]
		: [T['nature']] extends [keyof NatureMap]
			? NatureMap[T['nature']]
			: Function;

export interface FunctionDerivedCriteria<T extends FunctionSetableCriteria> extends DerivedCriteriaTemplate<
	FunctionMountedCriteria,
	FunctionGuardedCriteria<T>
> {}

export type FunctionExceptionCodes =
	| "NATURE_PROPERTY_MISDECLARED"
	| "NATURE_PROPERTY_STRING_MISCONFIGURED"
	| "NATURE_PROPERTY_ARRAY_MISCONFIGURED"
	| "NATURE_PROPERTY_ARRAY_ITEM_MISDECLARED"
	| "NATURE_PROPERTY_ARRAY_ITEM_MISCONFIGURED";

export type FunctionRejectionCodes =
	| "TYPE_FUNCTION_UNSATISFIED"
	| "NATURE_UNSATISFIED";

export interface FunctionCustomMembers {
	natureBitflags: Record<keyof NatureMap, number>;
	tagBitflags: Record<string, number>;
}