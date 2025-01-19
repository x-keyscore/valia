import {
	VariantCriteriaTemplate,
	ConcreteTypesTemplate,
	GenericTypesTemplate,
	VariantCriteria,
	FormatsGuard,
	MountedCriteria
} from "../types";

export interface TupleVariantCriteria extends VariantCriteriaTemplate<"tuple"> {
	tuple: [VariantCriteria, ...VariantCriteria[]];
	/** @default false */
	empty?: boolean;
}

export interface TupleDefaultCriteria {
	empty: boolean;
}

export interface TupleMountedCriteria {
	tuple: [MountedCriteria<VariantCriteria>, ...MountedCriteria<VariantCriteria>[]];
}

export interface TupleConcreteTypes extends ConcreteTypesTemplate<
	TupleVariantCriteria,
	TupleDefaultCriteria,
	TupleMountedCriteria
> {}

type TupleGuard<T extends VariantCriteria> =
	T extends TupleVariantCriteria
		? T['tuple'] extends infer U
			? {
				[I in keyof U]: U[I] extends VariantCriteria
					? FormatsGuard<U[I]>
					: never;
			}
			: never
		: never;

export type TupleGenericTypes<T extends VariantCriteria> = GenericTypesTemplate<
	TupleVariantCriteria,
	TupleGuard<T>
>