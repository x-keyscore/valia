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
 * 
 * @template T The name assigned to the format when the user selects
 * the type within the schema.
 */
export interface TemplateCriteria<T extends string> {
	type: T,
	label?: string;
	message?: string;
	/**
	 * @default true
	 */
	require?: boolean;
}

// FORMATS CONCRET TYPES

/**
 * @template T Extended interface of `TemplateCriteria` that defines
 * the format criteria users must or can specify.
 * 
 * @template U Default properties for those defined in `T` that must
 * be specified in the superclass reference within the format class.
 * 
 * @template V Additional or replacement properties that will be
 * defined after the criteria are mounted.
 */
export interface TemplateConcretTypes<
	T extends TemplateCriteria<string>,
	U extends Partial<T>,
	V extends Record<string, unknown>,
> {
	type: T['type'],
	criteria: T,
	defaultCriteria: U,
	mountedCritetia: V
}

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

export interface TemplateGenericTypes<
	T extends TemplateCriteria<string>,
	U,
> {
	type: T['type'],
	guard: U
}

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

// FORMATS CRITERIA

export type FormatsCriteria = {
	[U in FormatsConcretTypes['type']]: Extract<FormatsConcretTypes, { type: U }>['criteria']
}[FormatsConcretTypes['type']];

export type FormatsCriteriaMap = {
	[U in FormatsCriteria['type']]: Extract<FormatsCriteria, { type: U }>
};

export type DefaultCriteria<T extends FormatsCriteria> = {
	[U in T['type']]: FormatsConcretTypesMap[U]['defaultCriteria'];
}[T['type']];

export type MountedCriteria<T extends FormatsCriteria> = {
	[U in T['type']]:
		& DefaultGlobalCriteria
		& FormatsConcretTypesMap[U]['defaultCriteria']
		& T
		& FormatsConcretTypesMap[U]['mountedCritetia'];
}[T['type']];

// FORMATS GUARD

export type FormatsGuard<T extends FormatsCriteria> =
	T['require'] extends false
		? FormatsGenericTypesMap<T>[T['type']]['guard'] | undefined
		: NonNullable<FormatsGenericTypesMap<T>[T['type']]['guard']>;

// FORMAT

export type CheckValueResult = null | string;

// FORMATS

export type Formats = typeof formats[keyof typeof formats];

export type FormatsInstances = InstanceType<Formats>;
