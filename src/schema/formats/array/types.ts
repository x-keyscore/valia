import type {
	SetableCriteriaTemplate,
	DerivedCriteriaTemplate,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatTypes,
} from "../types";

export type SetableShape<T extends FormatTypes = FormatTypes> = [
	...(SetableCriteria<T> | SetableShape)[]
];

type SetableItem<T extends FormatTypes = FormatTypes> = SetableCriteria<T>;

interface SetableExtensibleRecord<T extends FormatTypes = FormatTypes> {
	min?: number;
	max?: number;
	item?: SetableItem<T>;
};

export interface ArraySetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"array"> {
	shape: SetableShape<T>;
	extensible?: SetableExtensibleRecord<T> | boolean;
}

type MountedShape<T extends SetableShape> =
	T extends infer U
		? {
			[I in keyof U]:
				U[I] extends SetableCriteria
					? MountedCriteria<U[I]>
					: U[I] extends SetableShape
						? MountedCriteria<{ type: "array", shape: U[I] }>
						: never;
		}
		: never;

interface MountedExtensibleRecord<T extends SetableExtensibleRecord> {
	min?: number;
	max?: number;
	item:
		unknown extends T['item']
			? undefined
			: SetableExtensibleRecord['item'] extends T['item']
				? MountedCriteria<SetableItem> | undefined
				: T['item'] extends SetableItem
					? MountedCriteria<T['item']>
					: T['item'];
}

export interface ArrayMountedCriteria<T extends ArraySetableCriteria> {
	shape: MountedShape<T['shape']>;
	extensible:
		unknown extends T['extensible']
			? false
			: ArraySetableCriteria['extensible'] extends T['extensible']
				? MountedExtensibleRecord<SetableExtensibleRecord> | boolean
				: T['extensible'] extends SetableExtensibleRecord
					? MountedExtensibleRecord<T['extensible']>
					: T['extensible'];
}

type GuardedDynamic<T extends ArraySetableCriteria['extensible']> =
	[T] extends [SetableExtensibleRecord]
		? T['item'] extends SetableItem
			? GuardedCriteria<T['item']>[]
			: []
		: [T] extends [true]
			? unknown[]
			: [];

type GuardedStatic<T extends SetableShape> =
	T extends infer U
		? {
			[I in keyof U]:
				U[I] extends SetableCriteria
					? GuardedCriteria<U[I]>
					: U[I] extends SetableShape
						? GuardedCriteria<{ type: "array", shape: U[I] }>
						: never;
		}
		: never;

type ArrayGuardedCriteria<T extends ArraySetableCriteria> =
	 GuardedDynamic<T['extensible']> extends infer U
		? GuardedStatic<T['shape']> extends infer V
			? U extends any[]
				? V extends any[]
					? [...V, ...U]
					: never
				: never
			: never
		: never;

export interface ArrayDerivedCriteria<T extends ArraySetableCriteria> extends DerivedCriteriaTemplate<
	ArrayMountedCriteria<T>,
	ArrayGuardedCriteria<T>
> {}

export type ArrayErrorCodes =
	| "SHAPE_PROPERTY_REQUIRED"
	| "SHAPE_PROPERTY_MALFORMED"
	| "SHAPE_PROPERTY_ARRAY_ITEM_MALFORMED"
    | "EXPANDABLE_PROPERTY_MALFORMED"
	| "EXPANDABLE__ITEM_PROPERTY_MALFORMED"
	| "EXPANDABLE__MIN_PROPERTY_MALFORMED"
	| "EXPANDABLE__MAX_PROPERTY_MALFORMED"
	| "EXPANDABLE__MIN_AND_MAX_PROPERTIES_MISCONFIGURED";

export type ArrayRejectCodes =
	| "TYPE_ARRAY_UNSATISFIED"
	| "SHAPE_UNSATISFIED"
	| "EXTENSIBLE_UNALLOWED"
	| "EXTENSIBLE_MIN_UNSATISFIED"
	| "EXTENSIBLE_MAX_UNSATISFIED";

export interface ArrayCustomMembers {
	isShorthandShape(obj: object): obj is SetableShape;
}