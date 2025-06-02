import type {
	SetableCriteriaTemplate,
	SpecTypesTemplate,
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

export interface ArrayDefaultCriteria {
	empty: boolean;
}

export interface ArraySpecTypes<T extends FormatNames> extends SpecTypesTemplate<
	ArraySetableCriteria<T>,
	ArrayDefaultCriteria
> {}

export interface ArrayMountedCriteria<T extends ArraySetableCriteria> {
	item: MountedCriteria<T['item']>;
}

export type ArrayGuardedCriteria<T extends ArraySetableCriteria> = GuardedCriteria<T['item']>[];

export interface ArrayFlowTypes<T extends ArraySetableCriteria> extends FlowTypesTemplate<
	ArrayMountedCriteria<T>,
	ArrayGuardedCriteria<T>
> {}