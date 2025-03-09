import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate, KeyofFormatClassicTypes,
	SetableCriteria, MountedCriteria, GuardedCriteria } from "../types";

export interface TupleSetableCriteria<
	T extends KeyofFormatClassicTypes = KeyofFormatClassicTypes
> extends SetableCriteriaTemplate<"tuple"> {
	tuple: [SetableCriteria<T>, ...SetableCriteria<T>[]];
}

export interface TupleClassicTypes<T extends KeyofFormatClassicTypes> extends ClassicTypesTemplate<
	TupleSetableCriteria<T>,
	{}
> {}

export interface TupleMountedCriteria {
	tuple: [MountedCriteria<SetableCriteria>, ...MountedCriteria<SetableCriteria>[]];
}

type TupleGuardedCriteria<T extends TupleSetableCriteria> =
	T['tuple'] extends infer U
		? {
			[I in keyof U]: U[I] extends SetableCriteria
				? GuardedCriteria<U[I]>
				: never;
		}
		: never;

export interface TupleGenericTypes<T extends TupleSetableCriteria> extends GenericTypesTemplate<
	TupleMountedCriteria,
	TupleGuardedCriteria<T>
> {}