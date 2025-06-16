import type { RecordSetableCriteria } from "../record/types";
import type {
	SetableCriteriaTemplate,
	SetableCriteriaMap,
	FlowTypesTemplate,
	SetableCriteria,
	MountedCriteria,
	GuardedCriteria,
	FormatNames
} from "../types";

export type SetableStruct<T extends FormatNames = FormatNames> = {
	[key: string | symbol]: SetableCriteria<T> | SetableStruct<T>;
};

export interface StructSetableCriteria<
	T extends FormatNames = FormatNames
> extends SetableCriteriaTemplate<"struct"> {
	struct: SetableStruct<T>;
	optional?: (string | symbol)[] | boolean;
	additional?: SetableCriteriaMap<T>['record'] | boolean;
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
    			? MountedCriteria<RecordSetableCriteria> | boolean
				: T['additional'] extends RecordSetableCriteria
					? MountedCriteria<T['additional']>
					: T['additional']
	acceptedKeys: Set<string | symbol>;
	requiredKeys: Set<string | symbol>;
}

type DynamicProperties<U extends RecordSetableCriteria | boolean | undefined> =
	[U] extends [RecordSetableCriteria]
		? GuardedCriteria<U>
		: [U] extends [false]
			? {}
			: { [key: string | symbol]: unknown; };

type OptionalizeKeys<T, U extends (string | symbol)[] | boolean | undefined> =
 	[U] extends [(string | symbol)[]]
		? { [K in keyof T as K extends U[number] ? K : never]+?: T[K]; }
		& { [K in keyof T as K extends U[number] ? never : K]-?: T[K]; }
		: [U] extends [false]
			? { [P in keyof T]-?: T[P]; }
			: { [P in keyof T]+?: T[P]; };

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

export interface StructFlowTypes<T extends StructSetableCriteria> extends FlowTypesTemplate<
	StructMountedCriteria<T>,
	StructGuardedCriteria<T>
> {}



