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

interface SetableAdditionalOptions<T extends FormatTypes = FormatTypes> {
	min?: number;
	max?: number;
	item?: SetableItem<T>;
};

export interface ArraySetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"array"> {
	shape: SetableShape<T>;
	additional?: boolean | SetableAdditionalOptions<T>;
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

interface MountedAdditionalOptions<T extends SetableAdditionalOptions> {
	min?: number;
	max?: number;
	item:
		unknown extends T['item']
			? undefined
			: SetableAdditionalOptions['item'] extends T['item']
				? MountedCriteria<SetableItem> | undefined
				: T['item'] extends SetableItem
					? MountedCriteria<T['item']>
					: T['item'];
}

export interface ArrayMountedCriteria<T extends ArraySetableCriteria> {
	shape: MountedShape<T['shape']>;
	additional:
		unknown extends T['additional']
			? false
			: ArraySetableCriteria['additional'] extends T['additional']
				? MountedAdditionalOptions<SetableAdditionalOptions> | boolean
				: T['additional'] extends SetableAdditionalOptions
					? MountedAdditionalOptions<T['additional']>
					: T['additional'];
}

type GuardedDynamic<T extends ArraySetableCriteria['additional']> =
	[T] extends [SetableAdditionalOptions]
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
	 GuardedDynamic<T['additional']> extends infer U
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

export type ArrayExceptionCodes =
	| "SHAPE_PROPERTY_REQUIRED"
	| "SHAPE_PROPERTY_MALFORMED"
	| "SHAPE_PROPERTY_ARRAY_ITEM_MALFORMED"
    | "ADDITIONAL_PROPERTY_MALFORMED"
	| "ADDITIONAL__ITEM_PROPERTY_MALFORMED"
	| "ADDITIONAL__MIN_PROPERTY_MALFORMED"
	| "ADDITIONAL__MAX_PROPERTY_MALFORMED"
	| "ADDITIONAL__MIN_AND_MAX_PROPERTIES_MISCONFIGURED";

export type ArrayRejectionCodes =
	| "TYPE_ARRAY_UNSATISFIED"
	| "SHAPE_UNSATISFIED"
	| "ADDITIONAL_UNALLOWED"
	| "ADDITIONAL_MIN_UNSATISFIED"
	| "ADDITIONAL_MAX_UNSATISFIED";

export interface ArrayCustomMembers {
	isShorthandShape(obj: object): obj is SetableShape;
}