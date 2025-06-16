import type { PathSegments, MountingChunk, CheckingChunk } from "../services";
import type { BooleanSetableCriteria, BooleanFlowTypes } from "./boolean/types";
import type { SymbolSetableCriteria, SymbolFlowTypes } from "./symbol/types";
import type { NumberSetableCriteria, NumberFlowTypes } from "./number/types";
import type { StringSetableCriteria, StringFlowTypes } from "./string/types";
import type { SimpleSetableCriteria, SimpleFlowTypes } from "./simple/types";
import type { RecordSetableCriteria, RecordFlowTypes } from "./record/types";
import type { StructSetableCriteria, StructFlowTypes } from "./struct/types";
import type { ArraySetableCriteria,  ArrayFlowTypes } from "./array/types";
import type { TupleSetableCriteria, TupleFlowTypes } from "./tuple/types";
import type { UnionSetableCriteria, UnionFlowTypes } from "./union/types";
import { formatNatives } from "./formats";
import { nodeSymbol } from "../services";

// SETABLE CRITERIA TEMPLATE

/**
 * Defines the criteria users must or can specify.
 * 
 * @template T The name assigned to the format when the user selects the type.
 */
export interface SetableCriteriaTemplate<T extends string> {
	type: T;
	label?: string;
	message?: string;
	nullish?: boolean;
}

// FORMATS PRIMA TYPES | Initial type representation (before schema usage)

/**
 * @template T Extended interface of `SetableCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 * 
 * @template U Default properties for those defined in `T` that must
 * be specified in the superclass reference within the format class.
 */
export interface SpecTypesTemplate<
	Setable extends SetableCriteriaTemplate<string>,
	Default extends Partial<Setable>
> {
	setableCriteria: Setable;
	defaultCriteria: Default;
}

export interface SetableCriteriaMap<T extends keyof SetableCriteriaMap = any> {
	boolean: BooleanSetableCriteria;
	symbol: SymbolSetableCriteria;
	number: NumberSetableCriteria;
	string: StringSetableCriteria;
	simple: SimpleSetableCriteria;
	record: RecordSetableCriteria<T>;
	struct: StructSetableCriteria<T>;
	array: ArraySetableCriteria<T>;
	tuple: TupleSetableCriteria<T>;
	union: UnionSetableCriteria<T>;
}

export type FormatNames = keyof SetableCriteriaMap;

// FORMATS FLOW TYPES

/**
 * @template Mounted A type that takes a generic parameter extending
 * 'SetableCriteria'. It is used to determine the type validated
 * by the format it represents, based on the criteria defined
 * by the user.
 * 
 * @template Guarded Properties that will be added to or override
 * the format criteria after the mounting process.
 */
export interface FlowTypesTemplate<Mounted, Guarded> {
	mountedCriteria: Mounted;
	guardedCriteria: Guarded;
}

export interface FormatFlowTypes<T extends SetableCriteria = SetableCriteria> {
	boolean: T extends BooleanSetableCriteria ? BooleanFlowTypes : never;
	symbol: T extends SymbolSetableCriteria ? SymbolFlowTypes : never;
	number: T extends NumberSetableCriteria ? NumberFlowTypes<T> : never
	string: T extends StringSetableCriteria ? StringFlowTypes<T> : never;
	simple: T extends SimpleSetableCriteria? SimpleFlowTypes<T> : never;
	record: T extends RecordSetableCriteria ? RecordFlowTypes<T> : never;
	struct: T extends StructSetableCriteria ? StructFlowTypes<T> : never;
	array: T extends ArraySetableCriteria ? ArrayFlowTypes<T> : never;
	tuple: T extends TupleSetableCriteria ? TupleFlowTypes<T> : never;
	union: T extends UnionSetableCriteria ? UnionFlowTypes<T> : never;
}

// SETABLE CRITERIA

export type SetableCriteria<T extends FormatNames = FormatNames> =
	SetableCriteriaMap<T>[T];

// MOUNTED CRITERIA

export interface GlobalMountedCriteria {
	[nodeSymbol]: {
		partPaths: PathSegments;
		childNodes: Set<MountedCriteria>;
	};
}

export type MountedCriteria<T extends SetableCriteria = SetableCriteria> = 
	T extends any
		? T extends { [nodeSymbol]: any }
			? T
			: (
				& Omit<T, keyof FormatFlowTypes<T>[T['type']]['mountedCriteria']>
				& FormatFlowTypes<T>[T['type']]['mountedCriteria']
				& GlobalMountedCriteria
			)
		: never;

// GUARDED CRITERIA

export type GuardedCriteria<T extends SetableCriteria = SetableCriteria> = 
	T['nullish'] extends true
		? FormatFlowTypes<T>[T['type']]['guardedCriteria'] | undefined | null
		: FormatFlowTypes<T>[T['type']]['guardedCriteria'];

// FORMAT

/**
 * @template T Extended interface of `SettableCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 * @template U Custom members you want to add to the format.
 */
export type Format<
	T extends SetableCriteria = SetableCriteria,
	U extends Record<string, any> = {}
> = {
	type: T['type'];
	mount?(
		chunk: MountingChunk,
		criteria: T
	): void;
    check(
		chunk: CheckingChunk,
        criteria: MountedCriteria<T>,
        value: unknown
    ): string | null;
} & U;

export type FormatNativeNames = (typeof formatNatives)[number]['type'];