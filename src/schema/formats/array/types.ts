import type {
	SetableCriteriaTemplate,
	DerivedCriteriaTemplate,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatTypes,
} from "../types";

type SetableItems<T extends FormatTypes = FormatTypes> = SetableCriteria<T>;

export type SetableTuple<T extends FormatTypes = FormatTypes> = (SetableCriteria<T> | SetableTuple)[];

export interface ArraySetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"array"> {
	min?: number;
	max?: number;
	tuple?: SetableTuple<T>;
	items?: SetableItems<T>;
}

type MountedTuple<T extends SetableTuple> =
	T extends infer U
		? {
			[I in keyof U]:
				U[I] extends SetableCriteria
					? MountedCriteria<U[I]>
					: U[I] extends SetableTuple
						? MountedCriteria<{ type: "array", tuple: U[I] }>
						: never;
		}
		: never;

export interface ArrayMountedCriteria<T extends ArraySetableCriteria> {
	tuple:
		unknown extends T['tuple']
			? undefined
			: ArraySetableCriteria['tuple'] extends T['tuple']
				? MountedTuple<SetableTuple> | undefined
				: T['tuple'] extends SetableTuple
					? MountedTuple<T['tuple']>
					: T['tuple'];
	items:
		unknown extends T['items']
			? undefined
			: ArraySetableCriteria['items'] extends T['items']
				? MountedCriteria<SetableItems> | undefined
				: T['items'] extends SetableItems
					? MountedCriteria<T['items']>
					: T['items'];
}

type GuardedDynamic<T extends ArraySetableCriteria['items']> =
	T extends SetableItems
		? GuardedCriteria<T>[]
		: [];

type GuardedStatic<T extends ArraySetableCriteria['tuple']> =
	T extends SetableTuple
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
	 [T['tuple'], T['items']] extends [undefined, undefined]
		? unknown[]
		: GuardedStatic<T['tuple']> extends infer U
			? GuardedDynamic<T['items']> extends infer V
				? [U, V] extends [never, never]
					? unknown[]
					: U extends any[]
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
	| "MIN_PROPERTY_MISDECLARED"
	| "MAX_PROPERTY_MISDECLARED"
	| "MIN_MAX_PROPERTIES_MISCONFIGURED"
	| "TUPLE_PROPERTY_MISDECLARED"
	| "TUPLE_PROPERTY_ARRAY_ITEM_MISDECLARED"
	| "TUPLE_MIN_PROPERTIES_MISCONFIGURED"
	| "TUPLE_MAX_PROPERTIES_MISCONFIGURED"
	| "TUPLE_MIN_MAX_PROPERTIES_ITEMS_PROPERTY_UNDEFINED"
	| "ITEMS_PROPERTY_MISDECLARED";

export type ArrayRejectionCodes =
	| "TYPE_ARRAY_UNSATISFIED"
	| "MIN_UNSATISFIED"
	| "MAX_UNSATISFIED"
	| "TUPLE_UNSATISFIED";

export interface ArrayCustomMembers {
	isShorthandTuple(obj: object): obj is SetableTuple;
}
