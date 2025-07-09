import type { ObjectSetableCriteria } from "../object/types";
import type {
	SetableCriteriaTemplate,
	DerivedCriteriaTemplate,
	SetableCriteriaMap,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatTypes
} from "../types";

export type SetableStruct<T extends FormatTypes = FormatTypes> = {
	[key: string | symbol]: SetableCriteria<T> | SetableStruct<T>;
};

export interface StructSetableCriteria<T extends FormatTypes = FormatTypes> extends SetableCriteriaTemplate<"struct"> {
	struct: SetableStruct<T>;
	strict?: boolean;
	optional?: (string | symbol)[] | boolean;
	additional?: SetableCriteriaMap<T>['object'] | boolean;
}

type MountedStruct<T extends SetableStruct> = {
	[K in keyof T]:
		T[K] extends SetableCriteria
			? MountedCriteria<T[K]>
			: T[K] extends SetableStruct
				? MountedCriteria<{ type: "struct", struct: T[K] }>
				: never;
};

export interface StructMountedCriteria<T extends StructSetableCriteria> {
	struct: MountedStruct<T['struct']>;
	strict:
		unknown extends T['strict']
			? true
			: ObjectSetableCriteria['strict'] extends T['strict']
				? boolean
				: T['strict'];
	optional:
		unknown extends T['optional']
			? false
			: StructSetableCriteria['optional'] extends T['optional']
    			? (string | symbol)[] | boolean
				: T['optional'];
	additional:
		unknown extends T['additional']
			? false
			: StructSetableCriteria['additional'] extends T['additional']
    			? MountedCriteria<ObjectSetableCriteria> | boolean
				: T['additional'] extends ObjectSetableCriteria
					? MountedCriteria<T['additional']>
					: T['additional']
	includedKeySet: Set<string | symbol>;
	unforcedKeySet: Set<string | symbol>;
	requiredKeySet: Set<string | symbol>;
}

type DynamicProperties<U extends ObjectSetableCriteria | boolean | undefined> =
	[U] extends [ObjectSetableCriteria]
		? GuardedCriteria<U>
		: [U] extends [true]
			? { [key: string | symbol]: unknown; }
			: {};

type OptionalizeKeys<T, U extends (string | symbol)[] | boolean | undefined> =
 	[U] extends [(string | symbol)[]]
		? { [K in keyof T as K extends U[number] ? K : never]+?: T[K]; }
		& { [K in keyof T as K extends U[number] ? never : K]-?: T[K]; }
		: [U] extends [true]
			? { [P in keyof T]+?: T[P]; }
			: { [P in keyof T]-?: T[P]; };

type StaticProperties<T extends StructSetableCriteria> = {
		-readonly [K in keyof OptionalizeKeys<T['struct'], T['optional']>]:
			T['struct'][K] extends SetableCriteria
				? GuardedCriteria<T['struct'][K]>
				: never;
}

type StructGuardedCriteria<T extends StructSetableCriteria> =
	DynamicProperties<T['additional']> extends infer U
		? StaticProperties<T> extends infer V
			? {
          		[K in keyof (U & V)]: 
           			K extends keyof V
						? V[K]
						: K extends keyof U
							? U[K]
							: never;
       		}
			: never
		: never;

export interface StructDerivedCriteria<T extends StructSetableCriteria> extends DerivedCriteriaTemplate<
	StructMountedCriteria<T>,
	StructGuardedCriteria<T>
> {}

export type StructErrors =
	| "STRUCT_PROPERTY_REQUIRED"
    | "STRUCT_PROPERTY_MALFORMED"
    | "STRUCT_PROPERTY_OBJECT_VALUE_MALFORMED"
	| "STRICT_PROPERTY_MALFORMED"
    | "OPTIONAL_PROPERTY_MALFORMED"
    | "OPTIONAL_PROPERTY_ARRAY_ITEM_MALFORMED"
    | "ADDITIONAL_PROPERTY_MALFORMED"
    | "ADDITIONAL_PROPERTY_OBJECT_MISCONFIGURED";

export type StringRejects =
 	| "TYPE_PLAIN_OBJECT_UNSATISFIED"
	| "TYPE_OBJECT_UNSATISFIED"
	| "STRUCT_UNSATISFIED"
	| "ADDITIONAL_UNALLOWED";

export interface StructMembers {
	getUnforcedKeys: (
		optional: boolean | (string | symbol)[],
		includedKeys: (string | symbol)[]
	) => (string | symbol)[];
	getRequiredKeys: (
		optional: boolean | (string | symbol)[],
		includedKeys: (string | symbol)[]
	) => (string | symbol)[];
	isShorthandStruct(obj: {}): obj is SetableStruct;
}
