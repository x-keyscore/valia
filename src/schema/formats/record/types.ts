import type {
	SetableCriteriaTemplate,
	FlowTypesTemplate,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatNames
} from "../types";

type SetableKey = SetableCriteria<"string" | "symbol">;

export interface RecordSetableCriteria<
	T extends FormatNames = FormatNames
> extends SetableCriteriaTemplate<"record"> {
	/** @default true */
	empty?: boolean
	min?: number;
	max?: number;
	key: SetableKey;
	value: SetableCriteria<T>;
}

export interface RecordMountedCriteria<T extends RecordSetableCriteria> {
	key: MountedCriteria<T['key']>;
	value: MountedCriteria<T['value']>;
	empty:
		unknown extends T['empty']
			? true
			: RecordSetableCriteria['empty'] extends T['empty']
				? boolean
				: T['empty'];
}

type RecordGuardedCriteria<T extends RecordSetableCriteria> =
	GuardedCriteria<T['key']> extends infer U
		? {
			[P in U as U extends (string | symbol) ? U : never]: 
				GuardedCriteria<T['value']>
		}
		: never;


export interface RecordFlowTypes<T extends RecordSetableCriteria> extends FlowTypesTemplate<
	RecordMountedCriteria<T>,
	RecordGuardedCriteria<T>
> {}