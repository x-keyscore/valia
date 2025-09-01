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

export interface ObjectSetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"object"> {
	nature?: "PLAIN";
	min?: number;
	max?: number;
	shape?: SetableShape<T>;
	optional?: (string | symbol)[] | boolean;
	keys?: SetableKey;
	values?: SetableValue<T>;
}

type MountedShape<T extends SetableShape> = {
	[K in keyof T]:
		T[K] extends SetableCriteria
			? MountedCriteria<T[K]>
			: T[K] extends SetableShape
				? MountedCriteria<{ type: "object", shape: T[K] }>
				: never;
};

export interface ObjectMountedCriteria<T extends ObjectSetableCriteria> {
	shape:
		unknown extends T['shape']
			? undefined
			: ObjectSetableCriteria['shape'] extends T['shape']
				? MountedShape<SetableShape> | undefined
				: T['shape'] extends SetableShape
					? MountedShape<T['shape']>
					: T['shape'];
	keys:
		unknown extends T['keys']
			? undefined
			: ObjectSetableCriteria['keys'] extends T['keys']
				? MountedCriteria<SetableKey> | undefined
				: T['keys'] extends SetableKey
					? MountedCriteria<T['keys']>
					: T['keys'];
	values:
		unknown extends T['values']
			? undefined
			: ObjectSetableCriteria['values'] extends T['values']
				? MountedCriteria<SetableCriteria> | undefined
				: T['values'] extends SetableCriteria
					? MountedCriteria<T['values']>
					: T['values'];
	declaredKeySet?: Set<string | symbol>;
	unforcedKeySet?: Set<string | symbol>;
	enforcedKeySet?: Set<string | symbol>;
}

type GuardedStaticKeys<T, U extends ObjectSetableCriteria['optional']> =
 	[U] extends [(string | symbol)[]]
		? { [K in keyof T as K extends U[number] ? K : never]+?: T[K]; } &
			{ [K in keyof T as K extends U[number] ? never : K]-?: T[K]; }
		: [U] extends [true]
			? { [P in keyof T]+?: T[P]; }
			: { [P in keyof T]-?: T[P]; };

type GuardedStatic<T extends ObjectSetableCriteria['shape'], U extends ObjectSetableCriteria['optional']> = 
	T extends SetableShape
		? {
			-readonly [K in keyof GuardedStaticKeys<T, U>]:
					T[K] extends SetableCriteria
						? GuardedCriteria<T[K]>
						: never;
		}
		: {};

type GuardedDynamic<T extends ObjectSetableCriteria['keys'], U extends ObjectSetableCriteria['values']> =
	T extends SetableKey
		? U extends SetableCriteria
			? GuardedCriteria<T> extends infer V
				? { [P in V as V extends PropertyKey ? V : never]: GuardedCriteria<U> }
				: never
			: GuardedCriteria<T> extends infer V
				? { [P in V as V extends PropertyKey ? V : never]: unknown }
				: never
		: U extends SetableCriteria
			? { [key: string | symbol]: GuardedCriteria<U> }
			: {};

type ObjectGuardedCriteria<T extends ObjectSetableCriteria> =
	 [T['shape'], T['keys'], T['values']] extends [undefined, undefined, undefined]
		? { [key: string | symbol]: unknown }
		: GuardedStatic<T['shape'], T['optional']> extends infer S
			? GuardedDynamic<T['keys'], T['values']> extends infer D
				? [S, D] extends [never, never]
					? { [key: string | symbol]: unknown }
					: S extends object
						? D extends object
							? {
								[K in keyof (D & S)]: 
									K extends keyof S
										? S[K]
										: K extends keyof D
											? D[K]
											: never;
							}
							: never
						: never
				: never
			: never;


export interface ObjectDerivedCriteria<T extends ObjectSetableCriteria> extends DerivedCriteriaTemplate<
	ObjectMountedCriteria<T>,
	ObjectGuardedCriteria<T>
> {}

export type ObjectExceptionCodes =
	| "NATURE_PROPERTY_MISDECLARED"
	| "NATURE_PROPERTY_MISCONFIGURED"
	| "MIN_PROPERTY_MISDECLARED"
	| "MAX_PROPERTY_MISDECLARED"
	| "MAX_MIN_PROPERTIES_MISCONFIGURED"
	| "SHAPE_PROPERTY_MISDECLARED"
	| "SHAPE_PROPERTY_OBJECT_VALUE_MISDECLARED"
	| "SHAPE_MIN_PROPERTIES_MISCONFIGURED"
	| "SHAPE_MAX_PROPERTIES_MISCONFIGURED"
	| "SHAPE_MIN_MAX_PROPERTIES_KEYS_VALUES_PROPERTIES_UNDEFINED"
	| "OPTIONAL_PROPERTY_MISDECLARED"
	| "OPTIONAL_PROPERTY_ARRAY_ITEM_MISDECLARED"
	| "OPTIONAL_PROPERTY_SHAPE_PROPERTY_UNDEFINED"
	| "KEYS_PROPERTY_MISDECLARED"
	| "KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_UNDEFINED"
	| "KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_MISDECLARED"
	| "KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_MISCONFIGURED"
	| "VALUES_PROPERTY_MISDECLARED";

export type ObjectRejectionCodes =
	| "TYPE_OBJECT_UNSATISFIED"
	| "NATURE_PLAIN_UNSATISFIED"
	| "MIN_UNSATISFIED"
	| "MAX_UNSATISFIED"
	| "SHAPE_UNSATISFIED";

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
