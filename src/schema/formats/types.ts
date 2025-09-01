import type { UndefinedSetableCriteria, UndefinedDerivedCriteria } from "./undefined/types";
import type { FunctionSetableCriteria, FunctionDerivedCriteria } from "./function/types";
import type { BooleanSetableCriteria, BooleanDerivedCriteria } from "./boolean/types";
import type { UnknownSetableCriteria, UnknownDerivedCriteria } from "./unknown/types";
import type { SymbolSetableCriteria, SymbolDerivedCriteria } from "./symbol/types";
import type { NumberSetableCriteria, NumberDerivedCriteria } from "./number/types";
import type { StringSetableCriteria, StringDerivedCriteria } from "./string/types";
import type { ObjectSetableCriteria, ObjectDerivedCriteria } from "./object/types";
import type { ArraySetableCriteria, ArrayDerivedCriteria } from "./array/types";
import type { UnionSetableCriteria, UnionDerivedCriteria } from "./union/types";
import type { NullSetableCriteria, NullDerivedCriteria } from "./null/types";
import type { NodePath, MounterChunkTask, CheckerChunkTask } from "../services";
import { formatNatives } from "./formats";
import { nodeSymbol } from "../services";

// FORMATS SETABLE TYPES

type SetableMessage = string | ((code?: string, data?: unknown, node?: MountedCriteria, nodePath?: NodePath) => string);

/**
 * Defines the criteria users must or can specify.
 * 
 * @template T The name assigned to the format when the user selects the type.
 */
export interface SetableCriteriaTemplate<T extends string> {
	type: T;
	label?: string;
	message?: SetableMessage;
}

export interface SetableCriteriaMap<T extends keyof SetableCriteriaMap = any> {
	undefined: UndefinedSetableCriteria;
	function: FunctionSetableCriteria;
	boolean: BooleanSetableCriteria;
	unknown: UnknownSetableCriteria;
	symbol: SymbolSetableCriteria;
	number: NumberSetableCriteria;
	string: StringSetableCriteria;
	object: ObjectSetableCriteria<T>;
	array: ArraySetableCriteria<T>;
	union: UnionSetableCriteria<T>;
	null: NullSetableCriteria;
}

export type FormatTypes = keyof SetableCriteriaMap;

// FORMATS DERIVED TYPES

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
	symbol: T extends SymbolSetableCriteria ? SymbolDerivedCriteria<T> : never;
	number: T extends NumberSetableCriteria ? NumberDerivedCriteria<T> : never;
	string: T extends StringSetableCriteria ? StringDerivedCriteria<T> : never;
	object: T extends ObjectSetableCriteria ? ObjectDerivedCriteria<T> : never;
	array: T extends ArraySetableCriteria ? ArrayDerivedCriteria<T> : never;
	union: T extends UnionSetableCriteria ? UnionDerivedCriteria<T> : never;
	undefined: UndefinedDerivedCriteria;
	boolean: BooleanDerivedCriteria;
	unknown: UnknownDerivedCriteria;
	null: NullDerivedCriteria;
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

type MethodMountedCriteria<T extends SetableCriteria> = {
	validate(data: unknown): data is GuardedCriteria<T>
} & T;

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
	DerivedCriteriaMap<T>[T['type']]['guarded'];

// FORMAT

/**
 * @template T
 * Type of the criteria this format handles.
 * 
 * @template ExceptionCodes
 * Possible exception codes that can be returned by the `mount` method.
 * 
 * @template RejectionCodes
 * Possible rejection codes that can be returned by the `check` method.
 * 
 * @template CustomMembers
 * Additional custom properties or methods added to the format object.
 */
export type Format<
	T extends SetableCriteria = SetableCriteria,
	ExceptionCodes extends string = string,
	RejectionCodes extends string = string,
	CustomMembers extends object = object
> = {
	type: T['type'];
	exceptions: { [K in ExceptionCodes]: string };
	mount(
		chunk: MounterChunkTask[],
		criteria: T
	): ExceptionCodes | null;
    check(
		chunk: CheckerChunkTask[],
        criteria: MountedCriteria<T>,
        data: unknown
    ): RejectionCodes | null;
} & CustomMembers;

export type FormatNativeTypes = (typeof formatNatives)[number]['type'];
