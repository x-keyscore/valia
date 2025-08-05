import type {
	SetableCriteriaTemplate,
	DerivedCriteriaTemplate,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatTypes
} from "../types";

export interface SetableShape<T extends FormatTypes = FormatTypes> {
	[key: string | symbol | number]: SetableCriteria<T> | SetableShape<T>;
};

type SetableKey = SetableCriteria<"string" | "symbol">;
type SetableValue<T extends FormatTypes = FormatTypes> = SetableCriteria<T>;

interface SetableAdditionalOptions<T extends FormatTypes = FormatTypes> {
	min?: number;
	max?: number;
	key?: SetableKey;
	value?: SetableValue<T>;
};

export interface ObjectSetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"object"> {
	shape: SetableShape<T>;
	nature?: "STANDARD" | "PLAIN";
	optional?: (string | symbol)[] | boolean;
	additional?: SetableAdditionalOptions<T> | boolean;
}

type MountedShape<T extends SetableShape> = {
	[K in keyof T]:
		T[K] extends SetableCriteria
			? MountedCriteria<T[K]>
			: T[K] extends SetableShape
				? MountedCriteria<{ type: "object", shape: T[K] }>
				: never;
};

interface MountedAdditionalOptions<T extends SetableAdditionalOptions> {
	min?: number;
	max?: number;
	key:
		unknown extends T['key']
			? undefined
			: SetableAdditionalOptions['key'] extends T['key']
				? MountedCriteria<SetableKey> | undefined
				: T['key'] extends SetableKey
					? MountedCriteria<T['key']>
					: T['key'];
	value:
		unknown extends T['value']
			? undefined
			: SetableAdditionalOptions['value'] extends T['value']
				? MountedCriteria<SetableCriteria> | undefined
				: T['value'] extends SetableCriteria
					? MountedCriteria<T['value']>
					: T['value'];
}

export interface ObjectMountedCriteria<T extends ObjectSetableCriteria> {
	shape: MountedShape<T['shape']>;
	nature:
		unknown extends T['nature']
			? "STANDARD"
			: ObjectSetableCriteria['nature'] extends T['nature']
				? NonNullable<ObjectSetableCriteria['nature']>
				: T['nature'];
	additional:
		unknown extends T['additional']
			? false
			: ObjectSetableCriteria['additional'] extends T['additional']
				? MountedAdditionalOptions<SetableAdditionalOptions> | boolean
				: T['additional'] extends SetableAdditionalOptions
					? MountedAdditionalOptions<T['additional']>
					: T['additional'];
	declaredKeySet?: Set<string | symbol>;
	unforcedKeySet?: Set<string | symbol>;
	enforcedKeySet?: Set<string | symbol>;
}

type GuardedDynamic<T extends ObjectSetableCriteria['additional']> =
	[T] extends [SetableAdditionalOptions]
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

type GuardedStaticKeys<T, U extends ObjectSetableCriteria['optional']> =
 	[U] extends [(string | symbol)[]]
		? { [K in keyof T as K extends U[number] ? K : never]+?: T[K]; } &
			{ [K in keyof T as K extends U[number] ? never : K]-?: T[K]; }
		: [U] extends [true]
			? { [P in keyof T]+?: T[P]; }
			: { [P in keyof T]-?: T[P]; };

type GuardedStatic<T extends SetableShape, U extends ObjectSetableCriteria['optional']> = {
	-readonly [K in keyof GuardedStaticKeys<T, U>]:
			T[K] extends SetableCriteria
				? GuardedCriteria<T[K]>
				: never;
};

type ObjectGuardedCriteria<T extends ObjectSetableCriteria> =
	GuardedDynamic<T['additional']> extends infer D
		? GuardedStatic<T['shape'], T['optional']> extends infer S
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

export type ObjectExceptionCodes =
	| "SHAPE_PROPERTY_MALFORMED"
	| "SHAPE_PROPERTY_OBJECT_VALUE_MALFORMED"
	| "NATURE_PROPERTY_MALFORMED"
	| "NATURE_PROPERTY_STRING_MISCONFIGURED"
	| "OPTIONAL_PROPERTY_MALFORMED"
	| "OPTIONAL_PROPERTY_ARRAY_ITEM_MALFORMED"
	| "OPTIONAL_PROPERTY_WITHOUT_SHAPE_PROPERTY_DEFINED"
    | "ADDITIONAL_PROPERTY_MALFORMED"
	| "ADDITIONAL_PROPERTY_WITHOUT_SHAPE_PROPERTY_DEFINED"
	| "ADDITIONAL__KEY_PROPERTY_MALFORMED"
	| "ADDITIONAL__KEY_PROPERTY_MISCONFIGURED"
	| "ADDITIONAL__VALUE_PROPERTY_MALFORMED"
	| "ADDITIONAL__MIN_PROPERTY_MALFORMED"
	| "ADDITIONAL__MAX_PROPERTY_MALFORMED"
	| "ADDITIONAL__MIN_AND_MAX_PROPERTIES_MISCONFIGURED";

export type ObjectRejectionCodes =
	| "TYPE_PLAIN_OBJECT_UNSATISFIED"
	| "TYPE_OBJECT_UNSATISFIED"
	| "SHAPE_UNSATISFIED"
	| "EXTENSIBLE_UNALLOWED"
	| "EXTENSIBLE_MIN_UNSATISFIED"
	| "EXTENSIBLE_MAX_UNSATISFIED";

export interface ObjectCustomMembers {
	natures: (ObjectSetableCriteria['nature'])[],
	getUnforcedKeys: (
		optional: boolean | (string | symbol)[],
		declaredKeys: (string | symbol)[]
	) => (string | symbol)[];
	getEnforcedKeys: (
		optional: boolean | (string | symbol)[],
		declaredKeys: (string | symbol)[]
	) => (string | symbol)[];
	isShorthandShape(obj: object): obj is SetableShape;
}
