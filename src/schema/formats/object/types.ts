import type {
	SetableCriteriaTemplate,
	DerivedCriteriaTemplate,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatTypes
} from "../types";

export type SetableShape<T extends FormatTypes = FormatTypes> = {
	[key: string | symbol | number]: SetableCriteria<T> | SetableShape<T>;
};

type SetableKey = SetableCriteria<"string" | "symbol">;
type SetableValue<T extends FormatTypes = FormatTypes> = SetableCriteria<T>;

interface SetableExtensibleRecord<T extends FormatTypes = FormatTypes> {
	min?: number;
	max?: number;
	key?: SetableKey;
	value?: SetableValue<T>;
};

export interface ObjectSetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"object"> {
	shape: SetableShape<T>;
	strict?: boolean;
	omittable?: (string | symbol)[] | boolean;
	extensible?: SetableExtensibleRecord<T> | boolean;
}

type MountedShape<T extends SetableShape> = {
	[K in keyof T]:
		T[K] extends SetableCriteria
			? MountedCriteria<T[K]>
			: T[K] extends SetableShape
				? MountedCriteria<{ type: "object", shape: T[K] }>
				: never;
};

interface MountedExtensibleRecord<T extends SetableExtensibleRecord> {
	min?: number;
	max?: number;
	key:
		unknown extends T['key']
			? undefined
			: SetableExtensibleRecord['key'] extends T['key']
				? MountedCriteria<SetableKey> | undefined
				: T['key'] extends SetableKey
					? MountedCriteria<T['key']>
					: T['key'];
	value:
		unknown extends T['value']
			? undefined
			: SetableExtensibleRecord['value'] extends T['value']
				? MountedCriteria<SetableCriteria> | undefined
				: T['value'] extends SetableCriteria
					? MountedCriteria<T['value']>
					: T['value'];
}

export interface ObjectMountedCriteria<T extends ObjectSetableCriteria> {
	shape: MountedShape<T['shape']>;
	strict:
		unknown extends T['strict']
			? true
			: ObjectSetableCriteria['strict'] extends T['strict']
				? boolean
				: T['strict'];
	extensible:
		unknown extends T['extensible']
			? false
			: ObjectSetableCriteria['extensible'] extends T['extensible']
				? MountedExtensibleRecord<SetableExtensibleRecord> | boolean
				: T['extensible'] extends SetableExtensibleRecord
					? MountedExtensibleRecord<T['extensible']>
					: T['extensible'];
	declaredKeySet: Set<string | symbol>;
	unforcedKeySet: Set<string | symbol>;
	enforcedKeySet: Set<string | symbol>;
}

type GuardedDynamic<T extends ObjectSetableCriteria['extensible']> =
	[T] extends [SetableExtensibleRecord]
		? T['key'] extends SetableKey
			? T['value'] extends SetableCriteria
				? GuardedCriteria<T['key']> extends infer U
					? { [P in U as U extends PropertyKey ? U : never]: GuardedCriteria<T['value']> }
					: never
				: GuardedCriteria<T['key']> extends infer U
					? { [P in U as U extends PropertyKey ? U : never]: unknown }
					: never
			: T['value'] extends SetableCriteria
				? { [key: PropertyKey]: GuardedCriteria<T['value']> }
				: {}
		: [T] extends [true]
			? { [key: PropertyKey]: unknown; }
			: {};

type GuardedStaticKeys<T, U extends ObjectSetableCriteria['omittable']> =
 	[U] extends [(string | symbol)[]]
		? { [K in keyof T as K extends U[number] ? K : never]+?: T[K]; } &
			{ [K in keyof T as K extends U[number] ? never : K]-?: T[K]; }
		: [U] extends [true]
			? { [P in keyof T]+?: T[P]; }
			: { [P in keyof T]-?: T[P]; };

type GuardedStatic<T extends SetableShape, U extends ObjectSetableCriteria['omittable']> = {
	-readonly [K in keyof GuardedStaticKeys<T, U>]:
			T[K] extends SetableCriteria
				? GuardedCriteria<T[K]>
				: never;
};

type ObjectGuardedCriteria<T extends ObjectSetableCriteria> =
	GuardedDynamic<T['extensible']> extends infer D
		? GuardedStatic<T['shape'], T['omittable']> extends infer S
			? {
				[K in keyof (D & S)]: 
					K extends keyof S
						? S[K]
						: K extends keyof D
							? D[K]
							: never;
			}
			: never
		: never;

export interface ObjectDerivedCriteria<T extends ObjectSetableCriteria> extends DerivedCriteriaTemplate<
	ObjectMountedCriteria<T>,
	ObjectGuardedCriteria<T>
> {}

export type ObjectErrorCodes =
	| "SHAPE_PROPERTY_REQUIRED"
	| "SHAPE_PROPERTY_MALFORMED"
	| "SHAPE_PROPERTY_OBJECT_VALUE_MALFORMED"
	| "STRICT_PROPERTY_MALFORMED"
	| "OMITTABLE_PROPERTY_MALFORMED"
	| "OMITTABLE_PROPERTY_ARRAY_ITEM_MALFORMED"
    | "EXPANDABLE_PROPERTY_MALFORMED"
	| "EXPANDABLE__KEY_PROPERTY_MALFORMED"
	| "EXPANDABLE__KEY_PROPERTY_MISCONFIGURED"
	| "EXPANDABLE__VALUE_PROPERTY_MALFORMED"
	| "EXPANDABLE__MIN_PROPERTY_MALFORMED"
	| "EXPANDABLE__MAX_PROPERTY_MALFORMED"
	| "EXPANDABLE__MIN_AND_MAX_PROPERTIES_MISCONFIGURED";

export type ObjectRejectCodes =
	| "TYPE_PLAIN_OBJECT_UNSATISFIED"
	| "TYPE_OBJECT_UNSATISFIED"
	| "SHAPE_UNSATISFIED"
	| "EXTENSIBLE_UNALLOWED"
	| "EXTENSIBLE_MIN_UNSATISFIED"
	| "EXTENSIBLE_MAX_UNSATISFIED";

export interface ObjectCustomMembers {
	getUnforcedKeys: (
		omittable: boolean | (string | symbol)[],
		declaredKeys: (string | symbol)[]
	) => (string | symbol)[];
	getEnforcedKeys: (
		omittable: boolean | (string | symbol)[],
		declaredKeys: (string | symbol)[]
	) => (string | symbol)[];
	isShorthandShape(obj: object): obj is SetableShape;
}
