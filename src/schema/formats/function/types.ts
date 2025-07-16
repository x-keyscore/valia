import type { SetableCriteriaTemplate, DerivedCriteriaTemplate } from "../types";
import type { BasicFunction, AsyncFunction } from "../../../testers";

interface VariantMap {
	BASIC: BasicFunction;
	ASYNC: AsyncFunction;
	BASIC_GENERATOR: GeneratorFunction;
	ASYNC_GENERATOR: AsyncGeneratorFunction;
}

export interface FunctionSetableCriteria extends SetableCriteriaTemplate<"function"> {
	variant?: keyof VariantMap | (keyof VariantMap)[];
}

export interface FunctionMountedCriteria {
	variantBitcode: number;
}

type FunctionGuardedCriteria<T extends FunctionSetableCriteria> =
	T['variant'] extends (keyof VariantMap)[]
		?  VariantMap[T['variant'][number]]
		: [T['variant']] extends [keyof VariantMap]
			? VariantMap[T['variant']]
			: Function;

export interface FunctionDerivedCriteria<T extends FunctionSetableCriteria> extends DerivedCriteriaTemplate<
	FunctionMountedCriteria,
	FunctionGuardedCriteria<T>
> {}

export type FunctionErrorCodes =
	| "VARIANT_PROPERTY_MALFORMED"
	| "VARIANT_PROPERTY_STRING_MISCONFIGURED"
	| "VARIANT_PROPERTY_ARRAY_LENGTH_MISCONFIGURED"
	| "VARIANT_PROPERTY_ARRAY_ITEM_MISCONFIGURED";

export type FunctionRejectCodes =
	| "TYPE_FUNCTION_UNSATISFIED"
	| "VARIANT_UNSATISFIED";

export interface FunctionCustomMembers {
	variantBitflags: Record<keyof VariantMap, number>;
	tagBitflags: Record<string, number>;
}