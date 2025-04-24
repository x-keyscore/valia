import type {
	SetableCriteriaTemplate,
	SpecTypesTemplate,
	FlowTypesTemplate,
	FormatGlobalNames,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria
} from "../types";

type SetableKey = SetableCriteria<"string" | "symbol">;

export interface RecordSetableCriteria<
	T extends FormatGlobalNames = FormatGlobalNames
> extends SetableCriteriaTemplate<"record"> {
	/** @default true */
	empty?: boolean
	min?: number;
	max?: number;
	key: SetableKey;
	value: SetableCriteria<T>;
}

export interface RecordDefaultCriteria {
	empty: boolean;
}

export interface RecordSpecTypes<T extends FormatGlobalNames> extends SpecTypesTemplate<
	RecordSetableCriteria<T>,
	RecordDefaultCriteria
> {}

export interface RecordMountedCriteria<T extends RecordSetableCriteria> {
	key: MountedCriteria<T['key']>;
	value: MountedCriteria<T['value']>;
}

type RecordGuardedCriteria<T extends RecordSetableCriteria> =
	GuardedCriteria<T['key']> extends infer U
		? U extends PropertyKey
			? { [P in U]: GuardedCriteria<T['value']> }
			: never
		: never;

export interface RecordFlowTypes<T extends RecordSetableCriteria> extends FlowTypesTemplate<
	RecordMountedCriteria<T>,
	RecordGuardedCriteria<T>
> {}