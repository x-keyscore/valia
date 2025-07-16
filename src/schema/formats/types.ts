import type { NodePath, MounterChunk, CheckerChunk } from "../services";
import type { FunctionSetableCriteria, FunctionDerivedCriteria } from "./function/types";
import type { BooleanSetableCriteria, BooleanDerivedCriteria } from "./boolean/types";
import type { SymbolSetableCriteria, SymbolDerivedCriteria } from "./symbol/types";
import type { NumberSetableCriteria, NumberDerivedCriteria } from "./number/types";
import type { StringSetableCriteria, StringDerivedCriteria } from "./string/types";
import type { SimpleSetableCriteria, SimpleDerivedCriteria } from "./simple/types";
import type { ObjectSetableCriteria, ObjectDerivedCriteria } from "./object/types";
import type { ArraySetableCriteria, ArrayDerivedCriteria } from "./array/types";
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
	nullable?: boolean;
}

export interface SetableCriteriaMap<T extends keyof SetableCriteriaMap = any> {
	function: FunctionSetableCriteria;
	boolean: BooleanSetableCriteria;
	symbol: SymbolSetableCriteria;
	number: NumberSetableCriteria;
	string: StringSetableCriteria;
	simple: SimpleSetableCriteria;
	object: ObjectSetableCriteria<T>;
	array: ArraySetableCriteria<T>;
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
	function: T extends FunctionSetableCriteria ? FunctionDerivedCriteria<T> : never;
	boolean: T extends BooleanSetableCriteria ? BooleanDerivedCriteria : never;
	symbol: T extends SymbolSetableCriteria ? SymbolDerivedCriteria : never;
	number: T extends NumberSetableCriteria ? NumberDerivedCriteria<T> : never
	string: T extends StringSetableCriteria ? StringDerivedCriteria<T> : never;
	simple: T extends SimpleSetableCriteria ? SimpleDerivedCriteria<T> : never;
	object: T extends ObjectSetableCriteria ? ObjectDerivedCriteria<T> : never;
	array: T extends ArraySetableCriteria ? ArrayDerivedCriteria<T> : never;
	union: T extends UnionSetableCriteria ? UnionDerivedCriteria<T> : never;
}

// SETABLE CRITERIA

export type SetableCriteria<T extends FormatTypes = FormatTypes> =
	SetableCriteriaMap<T>[T];

// MOUNTED CRITERIA

export interface CommonMountedCriteria {
	[nodeSymbol]: {
		partPath: Partial<NodePath>;
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
				& CommonMountedCriteria
			)
		: never;

// GUARDED CRITERIA

export type GuardedCriteria<T extends SetableCriteria = SetableCriteria> = 
	T['nullable'] extends true
		? DerivedCriteriaMap<T>[T['type']]['guarded'] | null
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
	mount(
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
