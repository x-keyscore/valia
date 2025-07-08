import type { ArraySetableCriteria } from "../array/types";
import type {
	SetableCriteriaTemplate,
	DerivedCriteriaTemplate,
	SetableCriteriaMap,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatTypes,
} from "../types";

export type SetableTuple<T extends FormatTypes = FormatTypes> =
	[SetableCriteria<T> | SetableTuple, ...(SetableCriteria<T> | SetableTuple)[]];

export interface TupleSetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"tuple"> {
	tuple: SetableTuple<T>;
	additional?: SetableCriteriaMap<T>['array'] | boolean;
}

type MountedTuple<T extends SetableTuple> =
	T extends infer U
		? {
			[I in keyof U]:
				U[I] extends SetableCriteria
					? MountedCriteria<U[I]>
					: U[I] extends SetableTuple
						? MountedCriteria<{ type: "tuple", tuple: U[I] }>
						: never;
		}
		: never;

export interface TupleMountedCriteria<T extends TupleSetableCriteria> {
	tuple: MountedTuple<T['tuple']>;
	additional:
		unknown extends T['additional']
			? false
			: TupleSetableCriteria['additional'] extends T['additional']
				? MountedCriteria<ArraySetableCriteria> | boolean
				: T['additional'] extends ArraySetableCriteria
					? MountedCriteria<T['additional']>
					: T['additional']
}

type DynamicItems<U extends ArraySetableCriteria | boolean | undefined> =
	[U] extends [ArraySetableCriteria]
		? GuardedCriteria<U>
		: [U] extends [false]
			? []
			: unknown[];

type StaticItems<T extends TupleSetableCriteria> =
	T['tuple'] extends infer U
		? {
			[I in keyof U]:
				U[I] extends SetableCriteria
					? GuardedCriteria<U[I]>
					: U[I] extends SetableTuple
						? GuardedCriteria<{ type: "tuple", tuple: U[I] }>
						: never;
		}
		: never;

type TupleGuardedCriteria<T extends TupleSetableCriteria> =
	DynamicItems<T['additional']> extends infer U
		? StaticItems<T> extends infer V
			? U extends any[]
				? V extends any[]
					? [...V, ...U]
					: never
				: never
			: never
		: never;

export interface TupleDerivedCriteria<T extends TupleSetableCriteria> extends DerivedCriteriaTemplate<
	TupleMountedCriteria<T>,
	TupleGuardedCriteria<T>
> {}

export type TupleErrors =
	| "TUPLE_PROPERTY_REQUIRED"
	| "TUPLE_PROPERTY_MALFORMED"
	| "TUPLE_PROPERTY_ARRAY_ITEM_MALFORMED"
	| "ADDITIONAL_PROPERTY_MALFORMED"
	| "ADDITIONAL_PROPERTY_OBJECT_MISCONFIGURED";

export type TupleRejects =
	| "TYPE_ARRAY_UNSATISFIED"
	| "TUPLE_UNSATISFIED"
	| "ADDITIONAL_UNALLOWED";

export interface TupleMembers {
	isShorthandTuple(obj: {}): obj is SetableTuple;
}