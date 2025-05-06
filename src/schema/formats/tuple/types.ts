import type {
	SetableCriteriaTemplate,
	SpecTypesTemplate,
	FlowTypesTemplate,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatNames
} from "../types";

export type SetableTuple<T extends FormatNames = FormatNames> =
	[SetableCriteria<T> | SetableTuple, ...(SetableCriteria<T> | SetableTuple)[]];

export interface TupleSetableCriteria<
	T extends FormatNames = FormatNames
> extends SetableCriteriaTemplate<"tuple"> {
	tuple: SetableTuple<T>;
}

export interface TupleSpecTypes<T extends FormatNames> extends SpecTypesTemplate<
	TupleSetableCriteria<T>,
	{}
> {}

type MountedTuple<T extends SetableTuple> =
	T extends infer U
		? {
			[I in keyof U]:
				U[I] extends SetableCriteria
					? MountedCriteria<U[I]>
					: U[I] extends SetableTuple
						? MountedCriteria<{ type: "tuple", tuple: U[I] }>
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
					: U[I] extends SetableTuple
						? GuardedCriteria<{ type: "tuple", tuple: U[I] }>
						: never;
		}
		: never;

export interface TupleFlowTypes<T extends TupleSetableCriteria> extends FlowTypesTemplate<
	TupleMountedCriteria<T>,
	TupleGuardedCriteria<T>
> {}