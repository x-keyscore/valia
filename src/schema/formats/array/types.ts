import type {
	SetableCriteriaTemplate,
	DerivedCriteriaTemplate,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatTypes,
} from "../types";

/*
nature?: string;
min?: number;
max?: number;
keys?: SetableKeys<T>;
values?: SetableValues<T>;
struct?: SetableStruct<T>;
optional?: string[] | boolean;
*/

/*
min?: number;
max?: number;
items?: SetableItems<T>;
tuple?: SetableTuple<T>;
*/

type SetableItems<T extends FormatTypes = FormatTypes> = SetableCriteria<T>;

export type SetableTuple<T extends FormatTypes = FormatTypes> = [
	...(SetableCriteria<T> | SetableTuple)[]
];

export interface ArraySetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"array"> {
	min?: number;
	max?: number;		
	tuple?: SetableTuple<T>;
	items?: SetableItems<T> | boolean;
}

type MountedTuple<T extends SetableTuple> =
	T extends infer U
		? {
			[I in keyof U]:
				U[I] extends SetableCriteria
					? MountedCriteria<U[I]>
					: U[I] extends SetableTuple
						? MountedCriteria<{ type: "array", shape: U[I] }>
						: never;
		}
		: never;

export interface ArrayMountedCriteria<T extends ArraySetableCriteria> {
	items:
		unknown extends T['items']
			? false
			: ArraySetableCriteria['items'] extends T['items']
				? MountedCriteria<SetableItems> | undefined
				: T['items'] extends SetableItems
					? MountedCriteria<T['items']>
					: T['items'];
	tuple:
		unknown extends T['tuple']
			? undefined
			: ArraySetableCriteria['tuple'] extends T['tuple']
				? MountedTuple<SetableTuple> | undefined
				: T['tuple'] extends SetableTuple
					? MountedTuple<T['tuple']>
					: T['tuple'];
}

type GuardedDynamic<T extends ArraySetableCriteria['items']> =
	T extends SetableCriteria
		? GuardedCriteria<T>[]
		: T extends true
			? unknown[]
			: [];

type GuardedStatic<T extends ArraySetableCriteria['tuple']> =
	T extends SetableCriteria[]
		? {
			[I in keyof T]:
				T[I] extends SetableCriteria
					? GuardedCriteria<T[I]>
					: T[I] extends SetableTuple
						? GuardedCriteria<{ type: "array", tuple: T[I] }>
						: never;
		}
		: [];

type ArrayGuardedCriteria<T extends ArraySetableCriteria> =
	GuardedStatic<T['tuple']> extends infer U
		? GuardedDynamic<T['items']> extends infer V
			? U extends any[]
				? V extends any[]
					? [...U, ...V]
					: never
				: never
			: never
		: never;

export interface ArrayDerivedCriteria<T extends ArraySetableCriteria> extends DerivedCriteriaTemplate<
	ArrayMountedCriteria<T>,
	ArrayGuardedCriteria<T>
> {}

export type ArrayExceptionCodes =
	| "MIN_PROPERTY_MALFORMED"
	| "MAX_PROPERTY_MALFORMED"
	| "MAX_MIN_PROPERTIES_MISCONFIGURED"
	| "TUPLE_PROPERTY_MALFORMED"
	| "TUPLE_MIN_PROPERTIES_MISCONFIGURED"
	| "TUPLE_PROPERTY_ARRAY_ITEM_MALFORMED"
	
    | "ITEMS_PROPERTY_MALFORMED";

export type ArrayRejectionCodes =
	| "TYPE_ARRAY_UNSATISFIED"
	| "TUPLE_UNSATISFIED"
	| "ADDITIONAL_UNALLOWED"
	| "ADDITIONAL_MIN_UNSATISFIED"
	| "ADDITIONAL_MAX_UNSATISFIED";

export interface ArrayCustomMembers {
	isShorthandTuple(obj: object): obj is SetableTuple;
}