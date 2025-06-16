import type {
	SetableCriteriaTemplate,
	FlowTypesTemplate,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatNames
} from "../types";

export interface ArraySetableCriteria<
	T extends FormatNames = FormatNames
> extends SetableCriteriaTemplate<"array"> {
	/** @default true */
	empty?: boolean;
	min?: number;
	max?: number;
	item: SetableCriteria<T>;
}

export interface ArrayMountedCriteria<T extends ArraySetableCriteria> {
	item: MountedCriteria<T['item']>;
	empty:
		unknown extends T['empty']
			? true
			: ArraySetableCriteria['empty'] extends T['empty']
				? boolean
				: T['empty'];
}

export type ArrayGuardedCriteria<T extends ArraySetableCriteria> = GuardedCriteria<T['item']>[];

export interface ArrayFlowTypes<T extends ArraySetableCriteria> extends FlowTypesTemplate<
	ArrayMountedCriteria<T>,
	ArrayGuardedCriteria<T>
> {}