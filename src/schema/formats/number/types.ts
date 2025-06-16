import type { SetableCriteriaTemplate, FlowTypesTemplate } from "../types";

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

export interface NumberMountedCriteria<T extends NumberSetableCriteria> {
	empty:
		unknown extends T['empty']
			? true
			: NumberSetableCriteria['empty'] extends T['empty']
				? boolean
				: T['empty'];
}

type NumberGuardedCriteria<T extends NumberSetableCriteria> = 
	T['enum'] extends number[]
		? T['enum'][number]
		: T['enum'] extends Record<string | number, number>
			? T['enum'][keyof T['enum']]
			: number;

export interface NumberFlowTypes<T extends NumberSetableCriteria> extends FlowTypesTemplate<
	NumberMountedCriteria<T>,
	NumberGuardedCriteria<T>
> {}