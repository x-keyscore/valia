import type {
	SetableCriteriaTemplate,
	FlowTypesTemplate,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatNames
} from "../types";

type SetableUnion<T extends FormatNames = FormatNames> =
	[SetableCriteria<T>, SetableCriteria<T>, ...SetableCriteria<T>[]];

export interface UnionSetableCriteria<
	T extends FormatNames = FormatNames
> extends SetableCriteriaTemplate<"union"> {
	union: SetableUnion<T>;
}

type MountedUnion<T extends SetableUnion> =
	T extends infer U
		? {
			[I in keyof U]:
				U[I] extends SetableCriteria
					? MountedCriteria<U[I]>
					: never;
		}
		: never;

export interface UnionMountedCriteria<T extends UnionSetableCriteria> {
	union: MountedUnion<T['union']>;
}

type UnionGuardedCriteria<T extends UnionSetableCriteria> =
	T['union'] extends infer U
		? {
			[I in keyof U]:
				U[I] extends SetableCriteria
					? GuardedCriteria<U[I]>
					: never;
		}[any]
		: never;

export interface UnionFlowTypes<T extends UnionSetableCriteria> extends FlowTypesTemplate<
	UnionMountedCriteria<T>,
	UnionGuardedCriteria<T>
> {}