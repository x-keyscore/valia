import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate } from "../types";

export interface NumberSetableCriteria extends SetableCriteriaTemplate<"number"> {
	min?: number;
	max?: number;
	enum?: number[] | Record<string | number, number>;
	custom?: (input: number) => boolean;
}

export interface NumberClassicTypes extends ClassicTypesTemplate<
	NumberSetableCriteria,
	{}
> {}

type NumberGuardedCriteria<T extends NumberSetableCriteria> = 
	T['enum'] extends number[]
		? T['enum'][number]
		: T['enum'] extends Record<string | number, number>
			? { [K in keyof T['enum']]: T['enum'][K] }[keyof T['enum']]
			: number;

export interface NumberGenericTypes<T extends NumberSetableCriteria> extends GenericTypesTemplate<
	{},
	NumberGuardedCriteria<T>
> {}