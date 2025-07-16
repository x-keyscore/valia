import type {
	SetableCriteriaTemplate,
	DerivedCriteriaTemplate,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatTypes
} from "../types";

type SetableUnion<T extends FormatTypes = FormatTypes> =
	[SetableCriteria<T>, ...SetableCriteria<T>[]];

export interface UnionSetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"union"> {
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

export interface UnionDerivedCriteria<T extends UnionSetableCriteria> extends DerivedCriteriaTemplate<
	UnionMountedCriteria<T>,
	UnionGuardedCriteria<T>
> {}

export type UnionErrorCodes = 
	| "UNION_PROPERTY_REQUIRED"
	| "UNION_PROPERTY_MALFORMED"
	| "UNION_PROPERTY_ARRAY_LENGTH_MISCONFIGURED"
	| "UNION_PROPERTY_ARRAY_ITEM_MALFORMED";
	

export type UnionRejectCodes = 
	| "UNION_UNSATISFIED";