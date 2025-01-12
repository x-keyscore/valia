import type { ArrayConcretTypes, ArrayGenericTypes } from "./array/types";
import type { BooleanConcretTypes, BooleanGenericTypes } from "./boolean/types";
import type { NumberConcretTypes, NumberGenericTypes } from "./number/types";
import type { RecordConcretTypes, RecordGenericTypes } from "./record/types";
import type { StringConcretTypes, StringGenericTypes } from "./string/types";
import type { StructConcretTypes, StructGenericTypes } from "./struct/types";
import type { SymbolConcretTypes, SymbolGenericTypes } from "./symbol/types";
import type { TupleConcretTypes, TupleGenericTypes } from "./tuple/types";
import { DefaultGlobalCriteria } from "./AbstractFormat";
import { formats } from "./formats";

// CRITERIA

/**
 * Defines the basic parameters of the criteria.
 */
export interface GlobalCriteria {
	label?: string;
	message?: string;
	/**
	 * @default true
	 */
	require?: boolean;
}

// FORMAT

export type CheckValueResult = null | string;

// FORMATS CRITERIA

export type Formats = typeof formats[keyof typeof formats];

export type FormatsInstances = InstanceType<Formats>;
/*
export type FormatsCriteria =
	| ArrayCriteria
	| TupleCriteria
	| RecordCriteria
	| StructCriteria
	| NumberCriteria
	| StringCriteria
	| SymbolCriteria
	| BooleanCriteria;*/




export type FormatsCriteriaMap = {
	[U in FormatsCriteria['type']]: Extract<FormatsCriteria, { type: U }>
};

// FORMATS DEFAULT CRITERIA
/*
export type FormatsDefaultCriteria =
	| DefaultTupleCriteria;

export type FormatsDefaultCriteriaMap = {
	[T in FormatsDefaultCriteria['type']]: Extract<FormatsDefaultCriteria, { type: T }>
};*/

// FORMATS MOUNTED CRITERIA
/*
export type FormatsMountedCriteria =
	| MountedTupleCriteria;

export type FormatsMountedCriteriaMap = {
	[U in FormatsMountedCriteria['type']]: Extract<FormatsMountedCriteria, { type: U }>
};*/
/*
export type MountedCriteria<T extends FormatsCriteria> = 
	& DefaultGlobalCriteria
	& FormatsConcretTypesMap[T['type']]['defaultCriteria']
	& T
	& FormatsConcretTypesMap[T['type']]['mountedCritetia'];*/

export type MountedCriteria<T extends FormatsCriteria> = {
	[U in T['type']]: 
		& DefaultGlobalCriteria
		& FormatsConcretTypesMap[U]['defaultCriteria']
		& T
		& FormatsConcretTypesMap[U]['mountedCritetia'];
}[T['type']];

export type DefaultCriteria<T extends FormatsCriteria> = {
	[U in T['type']]: FormatsConcretTypesMap[U]['defaultCriteria'];
}[T['type']];

// FORMATS CONCRET TYPES

export type FormatsConcretTypes =
	| ArrayConcretTypes
	| BooleanConcretTypes
	| NumberConcretTypes
	| RecordConcretTypes
	| StringConcretTypes
	| StructConcretTypes
	| SymbolConcretTypes
	| TupleConcretTypes;

export type FormatsConcretTypesMap = {
	[U in FormatsConcretTypes['type']]: Extract<FormatsConcretTypes, { type: U }>
};

// FORMATS GENERIC TYPES

export type FormatsGenericTypes<T extends FormatsCriteria> =
	| ArrayGenericTypes<T>
	| BooleanGenericTypes<T>
	| NumberGenericTypes<T>
	| RecordGenericTypes<T>
	| StringGenericTypes<T>
	| StructGenericTypes<T>
	| SymbolGenericTypes<T>
	| TupleGenericTypes<T>;

export type FormatsGenericTypesMap<T extends FormatsCriteria> = {
	[U in FormatsGenericTypes<T>['type']]: Extract<FormatsGenericTypes<T>, { type: U }>
};

// FORMATS

export type FormatsCriteria = {
	[U in FormatsConcretTypes['type']]: Extract<FormatsConcretTypes, { type: U }>['criteria']
}[FormatsConcretTypes['type']];


export type FormatsGuard<T extends FormatsCriteria> =
	T['require'] extends false
		? FormatsGenericTypesMap<T>[T['type']]['guard'] | undefined
		: NonNullable<FormatsGenericTypesMap<T>[T['type']]['guard']>;
