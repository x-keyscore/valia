import { StringSetableCriteria } from "../string/types";
import type {
	SetableCriteriaTemplate,
	DerivedCriteriaTemplate,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatTypes
} from "../types";

type SetableKey = SetableCriteria<"string" | "symbol">;

export interface ObjectSetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"object"> {
	key?: SetableKey;
	value?: SetableCriteria<T>;
	strict?: boolean;
	empty?: boolean;
	min?: number;
	max?: number;
}

export interface ObjectMountedCriteria<T extends ObjectSetableCriteria> {
	key:
		unknown extends T['key']
			? undefined
			: ObjectSetableCriteria['key'] extends T['key']
				? MountedCriteria<SetableKey> | undefined
				: T['key'] extends SetableKey
					? MountedCriteria<T['key']>
					: T['key'];
		
	value:
		unknown extends T['value']
			? undefined
			: ObjectSetableCriteria['value'] extends T['value']
				? MountedCriteria<SetableCriteria> | undefined
				: T['value'] extends SetableCriteria
					? MountedCriteria<T['value']>
					: T['value'];
	strict:
		unknown extends T['strict']
			? true
			: ObjectSetableCriteria['strict'] extends T['strict']
				? boolean
				: T['strict'];
	empty:
		unknown extends T['empty']
			? true
			: ObjectSetableCriteria['empty'] extends T['empty']
				? boolean
				: T['empty'];
}

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
			: { [key: string | symbol | number]: unknown };

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
