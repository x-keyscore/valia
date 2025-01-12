import type { GlobalCriteria, FormatsCriteria, FormatsGuard, MountedCriteria } from "../types";

type OmitIndexSignatures<K extends keyof any> =
	string extends K ? never :
	number extends K ? never :
	symbol extends K ? never :
	K;

type FormatName = "struct";

export interface StructCriteria extends GlobalCriteria {
	type: FormatName;
	empty?: boolean;
	struct: Record<PropertyKey, FormatsCriteria>;
}

interface DefaultStructCriteria {
	empty: boolean;
}

interface MountedStructCriteria {
	definedKeys: string[];
	requiredKeys: string[];
	struct: Record<PropertyKey, MountedCriteria<FormatsCriteria>>;
}

export type StructConcretTypes = {
	type: FormatName;
	criteria: StructCriteria;
	defaultCriteria: DefaultStructCriteria;
	mountedCritetia: MountedStructCriteria;
}

type NotRequireKeyMap<T extends StructCriteria['struct']> = {
	[P in keyof T]-?: T[P]['require'] extends false ? P : never
}[keyof T];

type NotRequireToOptional<T extends StructCriteria['struct']> =
	Partial<Pick<T, NotRequireKeyMap<T>>> &
	Pick<T, Exclude<keyof T, NotRequireKeyMap<T>>>;

type StructGuard<T extends FormatsCriteria> =
	T extends StructCriteria
		? { [K in keyof NotRequireToOptional<T['struct']> as OmitIndexSignatures<K>]: FormatsGuard<T['struct'][K]> }
		: never;

export type StructGenericTypes<T extends FormatsCriteria> = {
	type: FormatName;
	guard: StructGuard<T>;
}