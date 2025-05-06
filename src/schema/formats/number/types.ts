import type { SetableCriteriaTemplate, SpecTypesTemplate, FlowTypesTemplate } from "../types";

export interface NumberSetableCriteria extends SetableCriteriaTemplate<"number"> {
	/** @default true */
	empty?: boolean;
	min?: number;
	max?: number;
	enum?: number[] | Record<string | number, number>;
	custom?: (input: number) => boolean;
}

export interface NumberDefaultCriteria {
	empty: boolean;
}

export interface NumberSpecTypes extends SpecTypesTemplate<
	NumberSetableCriteria,
	NumberDefaultCriteria
> {}

type NumberGuardedCriteria<T extends NumberSetableCriteria> = 
	T['enum'] extends number[]
		? T['enum'][number]
		: T['enum'] extends Record<string | number, number>
			? T['enum'][keyof T['enum']]
			: number;

export interface NumberFlowTypes<T extends NumberSetableCriteria> extends FlowTypesTemplate<
	{},
	NumberGuardedCriteria<T>
> {}