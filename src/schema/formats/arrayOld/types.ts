import type {
	SetableCriteriaTemplate,
	DerivedCriteriaTemplate,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatTypes
} from "../types";

export interface ArraySetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"array"> {
	item?: SetableCriteria<T>;
	empty?: boolean;
	min?: number;
	max?: number;
}

export interface ArrayMountedCriteria<T extends ArraySetableCriteria> {
	item:
		unknown extends T['item']
			? undefined
			: ArraySetableCriteria['item'] extends T['item']
				? MountedCriteria<SetableCriteria> | undefined
				: T['item'] extends SetableCriteria
					? MountedCriteria<T['item']>
					: T['item'];
	empty:
		unknown extends T['empty']
			? true
			: ArraySetableCriteria['empty'] extends T['empty']
				? boolean
				: T['empty'];
}

export type ArrayGuardedCriteria<T extends ArraySetableCriteria> = 
	T['item'] extends SetableCriteria
		? GuardedCriteria<T['item']>[]
		: unknown[];

export interface ArrayDerivedCriteria<T extends ArraySetableCriteria> extends DerivedCriteriaTemplate<
	ArrayMountedCriteria<T>,
	ArrayGuardedCriteria<T>
> {}

export type ArrayErrors =
	| "ITEM_PROPERTY_REQUIRED"
	| "ITEM_PROPERTY_MALFORMED"
	| "EMPTY_PROPERTY_MALFORMED"
    | "MIN_PROPERTY_MALFORMED"
    | "MAX_PROPERTY_MALFORMED"
    | "MIN_AND_MAX_PROPERTIES_MISCONFIGURED";

export type ArrayRejects =
	| "TYPE_ARRAY_UNSATISFIED"
	| "EMPTY_UNALLOWED"
	| "MIN_UNSATISFIED"
	| "MAX_UNSATISFIED";
