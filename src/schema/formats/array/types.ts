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

interface SetableExpandableRecord<T extends FormatTypes = FormatTypes> {
	min?: number;
	max?: number;
	item?: SetableItem<T>;
};

export interface ArraySetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"array"> {
	shape: SetableShape<T>;
	expandable?: SetableExpandableRecord<T> | boolean;
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

interface MountedExpandableRecord<T extends SetableExpandableRecord> {
	min?: number;
	max?: number;
	item:
		unknown extends T['item']
			? undefined
			: SetableExpandableRecord['item'] extends T['item']
				? MountedCriteria<SetableItem> | undefined
				: T['item'] extends SetableItem
					? MountedCriteria<T['item']>
					: T['item'];
}

export interface ArrayMountedCriteria<T extends ArraySetableCriteria> {
	shape: MountedShape<T['shape']>;
	expandable:
		unknown extends T['expandable']
			? false
			: ArraySetableCriteria['expandable'] extends T['expandable']
				? MountedExpandableRecord<SetableExpandableRecord> | boolean
				: T['expandable'] extends SetableExpandableRecord
					? MountedExpandableRecord<T['expandable']>
					: T['expandable'];
}

type GuardedDynamic<T extends ArraySetableCriteria['expandable']> =
	[T] extends [SetableExpandableRecord]
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
	 GuardedDynamic<T['expandable']> extends infer U
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

export type ArrayErrors =
	| "SHAPE_PROPERTY_REQUIRED"
	| "SHAPE_PROPERTY_MALFORMED"
	| "SHAPE_PROPERTY_ARRAY_ITEM_MALFORMED"
    | "EXPANDABLE_PROPERTY_MALFORMED"
	| "EXPANDABLE__ITEM_PROPERTY_MALFORMED"
	| "EXPANDABLE__MIN_PROPERTY_MALFORMED"
	| "EXPANDABLE__MAX_PROPERTY_MALFORMED"
	| "EXPANDABLE__MIN_AND_MAX_PROPERTIES_MISCONFIGURED";

export type ArrayRejects =
	| "TYPE_ARRAY_UNSATISFIED"
	| "SHAPE_UNSATISFIED"
	| "EXPANDLABLE_UNALLOWED"
	| "EXPANDLABLE_MIN_UNSATISFIED"
	| "EXPANDLABLE_MAX_UNSATISFIED";

export interface ArrayMembers {
	isShorthandShape(obj: object): obj is SetableShape;
}