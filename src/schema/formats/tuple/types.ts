import type {
	SetableCriteriaTemplate,
	SpecTypesTemplate,
	FlowTypesTemplate,
	FormatGlobalNames,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria
} from "../types";

type SetableTuple<T extends FormatGlobalNames = FormatGlobalNames> =
	[SetableCriteria<T>, ...SetableCriteria<T>[]];

export interface TupleSetableCriteria<
	T extends FormatGlobalNames = FormatGlobalNames
> extends SetableCriteriaTemplate<"tuple"> {
	tuple: SetableTuple<T>;
}

export interface TupleSpecTypes<T extends FormatGlobalNames> extends SpecTypesTemplate<
	TupleSetableCriteria<T>,
	{}
> {}

type MountedTuple<T extends SetableTuple> =
	T extends infer U
		? {
			[I in keyof U]:
				U[I] extends SetableCriteria
					? MountedCriteria<U[I]>
					: never;
		}
		: never;

export interface TupleMountedCriteria<T extends TupleSetableCriteria> {
	tuple: MountedTuple<T['tuple']>;
}

type TupleGuardedCriteria<T extends TupleSetableCriteria> =
	T['tuple'] extends infer U
		? {
			[I in keyof U]:
				U[I] extends SetableCriteria
					? GuardedCriteria<U[I]>
					: never;
		}
		: never;

export interface TupleFlowTypes<T extends TupleSetableCriteria> extends FlowTypesTemplate<
	TupleMountedCriteria<T>,
	TupleGuardedCriteria<T>
> {}