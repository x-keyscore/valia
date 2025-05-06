import type {
	SetableCriteriaTemplate,
	SpecTypesTemplate,
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
	optional?: (string | symbol)[];
	struct: SetableStruct<T>;
}

export interface StructSpecTypes<T extends FormatNames> extends SpecTypesTemplate<
	StructSetableCriteria<T>,
	{}
> {}

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
	acceptedKeys: Set<string | symbol>;
	requiredKeys:  Set<string | symbol>;
}

type OptionalizeKeys<T, K extends PropertyKey[] | undefined> = 
	K extends PropertyKey[]
		? { [P in keyof T as P extends K[number] ? P : never]+?: T[P]; } 
		& { [P in keyof T as P extends K[number] ? never : P]-?: T[P]; }
		: T;

type StructGuardedCriteria<T extends StructSetableCriteria> = {
	-readonly [K in keyof OptionalizeKeys<T['struct'], T['optional']>]:
		T['struct'][K] extends SetableCriteria
			? GuardedCriteria<T['struct'][K]>
			: T['struct'][K] extends SetableStruct
				? GuardedCriteria<{ type: "struct", struct: T['struct'][K] }>
				: never;
} extends infer R ? R : never;

export interface StructFlowTypes<T extends StructSetableCriteria> extends FlowTypesTemplate<
	StructMountedCriteria<T>,
	StructGuardedCriteria<T>
> {}
