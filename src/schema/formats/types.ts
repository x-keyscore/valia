import type { NodePaths, MounterChunk, CheckerChunk } from "../services";
import type { BooleanSetableCriteria, BooleanDerivedCriteria } from "./boolean/types";
import type { SymbolSetableCriteria, SymbolDerivedCriteria } from "./symbol/types";
import type { NumberSetableCriteria, NumberDerivedCriteria } from "./number/types";
import type { StringSetableCriteria, StringDerivedCriteria } from "./string/types";
import type { SimpleSetableCriteria, SimpleDerivedCriteria } from "./simple/types";
import type { ObjectSetableCriteria, ObjectDerivedCriteria } from "./object/types";
import type { StructSetableCriteria, StructDerivedCriteria } from "./struct/types";
import type { ArraySetableCriteria,  ArrayDerivedCriteria } from "./array/types";
import type { TupleSetableCriteria, TupleDerivedCriteria } from "./tuple/types";
import type { UnionSetableCriteria, UnionDerivedCriteria } from "./union/types";
import { formatNatives } from "./formats";
import { nodeSymbol } from "../services";

// FORMATS SETABLE TYPES

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

export interface SetableCriteriaMap<T extends keyof SetableCriteriaMap = any> {
	boolean: BooleanSetableCriteria;
	symbol: SymbolSetableCriteria;
	number: NumberSetableCriteria;
	string: StringSetableCriteria;
	simple: SimpleSetableCriteria;
	object: ObjectSetableCriteria<T>;
	struct: StructSetableCriteria<T>;
	array: ArraySetableCriteria<T>;
	tuple: TupleSetableCriteria<T>;
	union: UnionSetableCriteria<T>;
}

export type FormatTypes = keyof SetableCriteriaMap;

// FORMATS HANDLED TYPES

/**
 * @template Mounted A type that takes a generic parameter extending
 * 'SetableCriteria'. It is used to determine the type validated
 * by the format it represents, based on the criteria defined
 * by the user.
 * 
 * @template Guarded Properties that will be added to or override
 * the format criteria after the mounting process.
 */
export interface DerivedCriteriaTemplate<Mounted, Guarded> {
	mounted: Mounted;
	guarded: Guarded;
}

export interface DerivedCriteriaMap<T extends SetableCriteria = SetableCriteria> {
	boolean: T extends BooleanSetableCriteria ? BooleanDerivedCriteria : never;
	symbol: T extends SymbolSetableCriteria ? SymbolDerivedCriteria : never;
	number: T extends NumberSetableCriteria ? NumberDerivedCriteria<T> : never
	string: T extends StringSetableCriteria ? StringDerivedCriteria<T> : never;
	simple: T extends SimpleSetableCriteria ? SimpleDerivedCriteria<T> : never;
	object: T extends ObjectSetableCriteria ? ObjectDerivedCriteria<T> : never;
	struct: T extends StructSetableCriteria ? StructDerivedCriteria<T> : never;
	array: T extends ArraySetableCriteria ? ArrayDerivedCriteria<T> : never;
	tuple: T extends TupleSetableCriteria ? TupleDerivedCriteria<T> : never;
	union: T extends UnionSetableCriteria ? UnionDerivedCriteria<T> : never;
}

// SETABLE CRITERIA

export type SetableCriteria<T extends FormatTypes = FormatTypes> =
	SetableCriteriaMap<T>[T];

// MOUNTED CRITERIA

export interface GlobalMountedCriteria {
	[nodeSymbol]: {
		partPaths: NodePaths;
		childNodes: Set<MountedCriteria>;
	};
}

export type MountedCriteria<T extends SetableCriteria = SetableCriteria> = 
	T extends any
		? T extends { [nodeSymbol]: any }
			? T
			: (
				& Omit<T, keyof DerivedCriteriaMap<T>[T['type']]['mounted']>
				& DerivedCriteriaMap<T>[T['type']]['mounted']
				& GlobalMountedCriteria
			)
		: never;

// GUARDED CRITERIA

export type GuardedCriteria<T extends SetableCriteria = SetableCriteria> = 
	T['nullish'] extends true
		? DerivedCriteriaMap<T>[T['type']]['guarded'] | undefined | null
		: DerivedCriteriaMap<T>[T['type']]['guarded'];

// FORMAT

/**
 * @template T Extended interface of `SettableCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 * @template E Error codes you want to use in the format.
 * @template M Custom members you want to add to the format.
 */
export type Format<
	T extends SetableCriteria = SetableCriteria,
	E extends string = string,
	R extends string = string,
	M extends {} = {}
> = {
	type: T['type'];
	errors: { [K in E]: string };
	mount?(
		chunk: MounterChunk,
		criteria: T
	): E | null;
    check(
		chunk: CheckerChunk,
        criteria: MountedCriteria<T>,
        value: unknown
    ): R | null;
} & M;

export type FormatNativeTypes = (typeof formatNatives)[number]['type'];
