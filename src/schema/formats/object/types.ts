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
type SetableValue<T extends FormatTypes = FormatTypes> = SetableCriteria<T>

interface SetableAdditionalRecord {
	empty?: boolean;
	min?: number;
	max?: number;
	key?: SetableKey;
	value?: SetableValue;
};

export interface ObjectSetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"object"> {
	shape: SetableShape<T>;
	strict?: boolean;
	optional?: (string | symbol)[] | boolean;
	additional?: SetableAdditionalRecord | boolean;
}

type MountedShape<T extends SetableShape> = {
	[K in keyof T]:
		T[K] extends SetableCriteria
			? MountedCriteria<T[K]>
			: T[K] extends SetableShape
				? MountedCriteria<{ type: "object", shape: T[K] }>
				: never;
};

interface MountedAdditionalRecord<T extends SetableAdditionalRecord> {
	empty:
		undefined extends T['empty']
			? true
			: SetableAdditionalRecord['empty'] extends T['empty']
				? boolean
				: T['empty'];
	key:
		unknown extends T['key']
			? undefined
			: SetableAdditionalRecord['key'] extends T['key']
				? MountedCriteria<SetableKey> | undefined
				: T['key'] extends SetableKey
					? MountedCriteria<T['key']>
					: T['key'];
	value:
		unknown extends T['value']
			? undefined
			: SetableAdditionalRecord['value'] extends T['value']
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
	additional:
		unknown extends T['additional']
			? false
			: ObjectSetableCriteria['additional'] extends T['additional']
				? MountedAdditionalRecord<SetableAdditionalRecord> | boolean
				: T['additional'] extends SetableAdditionalRecord
					? MountedAdditionalRecord<T['additional']>
					: T['additional'];
}
/*
empty:
	unknown extends T['empty']
		? true
		: ObjectSetableCriteria['empty'] extends T['empty']
			? boolean
			: T['empty'];
*/

type GuardedDynamic<T extends ObjectSetableCriteria['additional']> =
	[T] extends [SetableAdditionalRecord]
		? T['key'] extends SetableKey
			? T['value'] extends SetableCriteria
				? GuardedCriteria<T['key']> extends infer U
					? { [P in U as U extends (string | symbol) ? U : never]: GuardedCriteria<T['value']> }
					: never
				: GuardedCriteria<T['key']> extends infer U
					? { [P in U as U extends (string | symbol) ? U : never]: unknown }
					: never
			: T['value'] extends SetableCriteria
				? { [key: string | symbol | number]: GuardedCriteria<T['value']> }
				: { [key: string | symbol | number]: unknown }
		: [T] extends [true]
			? { [key: string | symbol]: unknown; }
			: {};

type GuardedStatic<T extends ObjectSetableCriteria> = {};

type ObjectGuardedCriteria<T extends ObjectSetableCriteria> =
	GuardedDynamic<T['additional']> extends infer D
		? GuardedStatic<T> extends infer S
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

/*
type ObjectGuardedCriteria<T extends ObjectSetableCriteria> =
	T['key'] extends SetableKey
		? T['value'] extends SetableCriteria
			? GuardedCriteria<T['key']> extends infer U
				? { [P in U as U extends (string | symbol) ? U : never]: GuardedCriteria<T['value']> }
				: never
			: GuardedCriteria<T['key']> extends infer U
				? { [P in U as U extends (string | symbol) ? U : never]: unknown }
				: never
		: T['value'] extends SetableCriteria
			? { [key: string | symbol | number]: GuardedCriteria<T['value']> }
			: { [key: string | symbol | number]: unknown };*/

export interface ObjectDerivedCriteria<T extends ObjectSetableCriteria> extends DerivedCriteriaTemplate<
	ObjectMountedCriteria<T>,
	ObjectGuardedCriteria<T>
> {}

export type ObjectErrors =
    | "KEY_PROPERTY_REQUIRED"
	| "KEY_PROPERTY_MALFORMED"
    | "VALUE_PROPERTY_REQUIRED"
	| "VALUE_PROPERTY_MALFORMED"
	| "STRICT_PROPERTY_MALFORMED"
    | "EMPTY_PROPERTY_MALFORMED"
    | "MIN_PROPERTY_MALFORMED"
    | "MAX_PROPERTY_MALFORMED"
    | "MIN_AND_MAX_PROPERTIES_MISCONFIGURED";

export type ObjectRejects =
	| "TYPE_PLAIN_OBJECT_UNSATISFIED"
	| "TYPE_OBJECT_UNSATISFIED"
	| "EMPTY_UNALLOWED"
	| "MIN_UNSATISFIED"
	| "MAX_UNSATISFIED";
