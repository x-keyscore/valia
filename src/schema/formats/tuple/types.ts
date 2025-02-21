import type { SetableCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate,
	SetableCriteria, MountedCriteria, GuardedCriteria } from "../types";

export interface TupleSetableCriteria extends SetableCriteriaTemplate<"tuple"> {
	tuple: [SetableCriteria, ...SetableCriteria[]];
}

export interface TupleConcreteTypes extends ConcreteTypesTemplate<
	TupleSetableCriteria,
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
	TupleSetableCriteria,
	TupleMountedCriteria,
	TupleGuardedCriteria<T>
> {}