import { VariantCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, FormatsGuard, VariantCriteria, MountedCriteria } from "../types";

export interface UnionVariantCriteria extends VariantCriteriaTemplate<"union"> {
	union: [VariantCriteria, ...VariantCriteria[]];
	/** @default false */
	empty?: boolean;
}

export interface UnionDefaultCriteria {
	empty: boolean;
}

export interface UnionMountedCriteria {
	union: [MountedCriteria<VariantCriteria>, ...MountedCriteria<VariantCriteria>[]];
}

export interface UnionConcreteTypes extends ConcreteTypesTemplate<
	UnionVariantCriteria,
	UnionDefaultCriteria,
	UnionMountedCriteria
> {}

type UnionGuard<T extends VariantCriteria> =
	T extends UnionVariantCriteria
		? {
			[I in keyof T['union']]:
				T['union'][I] extends VariantCriteria
					? FormatsGuard<T['union'][I]>
					: never;
		}[keyof T['union']]
		: never;

export type UnionGenericTypes<T extends VariantCriteria> = GenericTypesTemplate<
	UnionVariantCriteria,
	UnionGuard<T>
>