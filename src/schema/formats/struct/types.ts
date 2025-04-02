import type {
	SetableCriteriaTemplate,
	ClassicTypesTemplate,
	GenericTypesTemplate,
	FormatGlobalNames,
	SetableCriteria,
	GuardedCriteria,
	MountedCriteria
} from "../types";

export type StructDefinition<T extends FormatGlobalNames = FormatGlobalNames> = {
    [key: string | symbol]: SetableCriteria<T> | StructDefinition<T>;
};

export interface StructSetableCriteria<
	T extends FormatGlobalNames = FormatGlobalNames
> extends SetableCriteriaTemplate<"struct"> {
	optional?: (string | symbol)[];
	struct: StructDefinition<T>;
}

export interface StructClassicTypes<T extends FormatGlobalNames> extends ClassicTypesTemplate<
	StructSetableCriteria<T>,
	{}
> {}

type SimulateStruct<T> = StructSetableCriteria & { struct: T; };

type MountedStruct<T extends StructDefinition> = {
	[K in keyof T]:
		T[K] extends SetableCriteria
			? MountedCriteria<T[K]>
			: T[K] extends StructDefinition
				? MountedCriteria<SimulateStruct<T[K]>>
				: T[K] extends (SetableCriteria | StructDefinition)
					? MountedCriteria<SetableCriteria>
					: T[K];
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
			: T['struct'][K] extends StructDefinition
				? GuardedCriteria<SimulateStruct<T['struct'][K]>>
				: never;
};

export interface StructGenericTypes<T extends StructSetableCriteria> extends GenericTypesTemplate<
	StructMountedCriteria<T>,
	StructGuardedCriteria<T>
> {}
