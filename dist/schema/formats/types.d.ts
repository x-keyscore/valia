import type { ArrayConcreteTypes, ArrayGenericTypes } from "./array/types";
import type { BooleanConcreteTypes, BooleanGenericTypes } from "./boolean/types";
import type { NumberConcreteTypes, NumberGenericTypes } from "./number/types";
import type { RecordConcreteTypes, RecordGenericTypes } from "./record/types";
import type { StringConcreteTypes, StringGenericTypes } from "./string/types";
import type { StructConcreteTypes, StructGenericTypes } from "./struct/types";
import type { SymbolConcreteTypes, SymbolGenericTypes } from "./symbol/types";
import type { TupleConcreteTypes, TupleGenericTypes } from "./tuple/types";
import type { UnionConcreteTypes, UnionGenericTypes } from "./union/types";
import type { CheckingTask, MountingTask } from "../services";
import { MapperInstance, mapperSymbol } from "../handlers";
import { formats } from "./formats";
export interface BasicTunableCriteria {
    label?: string;
    message?: string;
    /** @default false */
    nullable?: boolean;
    /** @default false */
    undefinable?: boolean;
}
export interface StaticTunableCriteria {
    nullable: boolean;
    undefinable: boolean;
}
/**
 * Defines the criteria users must or can specify.
 *
 * @template T The name assigned to the format when the user selects the type.
 */
export interface TunableCriteriaTemplate<T extends string> extends BasicTunableCriteria {
    type: T;
}
/**
 * @template T Extended interface of `TunableCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 *
 * @template U Default properties for those defined in `T` that must
 * be specified in the superclass reference within the format class.
 */
export interface ConcreteTypesTemplate<T extends TunableCriteriaTemplate<string>, U extends Partial<T>> {
    type: T['type'];
    tunableCriteria: T;
    defaultCriteria: U;
}
export type FormatsConcreteTypes = ArrayConcreteTypes | BooleanConcreteTypes | NumberConcreteTypes | RecordConcreteTypes | StringConcreteTypes | StructConcreteTypes | SymbolConcreteTypes | TupleConcreteTypes | UnionConcreteTypes;
export type FormatsConcreteTypesMap = {
    [U in FormatsConcreteTypes['type']]: Extract<FormatsConcreteTypes, {
        type: U;
    }>;
};
/**
 * @template T Extended interface of `TunableCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 *
 * @template U A type that takes a generic parameter extending
 * 'TunableCriteria'. It is used to determine the type validated
 * by the format it represents, based on the criteria defined
 * by the user.
 *
 * @template V Properties that will be added to or override
 * the format criteria after the mounting process.
 */
export interface GenericTypesTemplate<T extends TunableCriteriaTemplate<string>, U, V> {
    type: T['type'];
    mountedCriteria: U;
    guardedCriteria: V;
}
export type FormatsGenericTypes<T extends TunableCriteria> = T extends TunableCriteriaMap['array'] ? ArrayGenericTypes<T> : T extends TunableCriteriaMap['boolean'] ? BooleanGenericTypes<T> : T extends TunableCriteriaMap['number'] ? NumberGenericTypes<T> : T extends TunableCriteriaMap['record'] ? RecordGenericTypes<T> : T extends TunableCriteriaMap['string'] ? StringGenericTypes<T> : T extends TunableCriteriaMap['struct'] ? StructGenericTypes<T> : T extends TunableCriteriaMap['symbol'] ? SymbolGenericTypes<T> : T extends TunableCriteriaMap['tuple'] ? TupleGenericTypes<T> : T extends TunableCriteriaMap['union'] ? UnionGenericTypes<T> : never;
export type TunableCriteria = FormatsConcreteTypes['tunableCriteria'];
export type TunableCriteriaMap = {
    [U in TunableCriteria['type']]: Extract<TunableCriteria, {
        type: U;
    }>;
};
export type DefaultCriteria<T extends TunableCriteria = TunableCriteria> = {
    [U in T['type']]: FormatsConcreteTypesMap[U]['defaultCriteria'];
}[T['type']];
export interface StaticMountedCriteria {
    [mapperSymbol]: MapperInstance;
}
export type MountedCriteria<T extends TunableCriteria> = T extends any ? StaticTunableCriteria & FormatsConcreteTypesMap[T['type']]['defaultCriteria'] & Omit<T, keyof FormatsGenericTypes<T>['mountedCriteria']> & FormatsGenericTypes<T>['mountedCriteria'] & StaticMountedCriteria : never;
export type GuardedCriteria<T extends TunableCriteria> = FormatsGenericTypes<T>['guardedCriteria'];
/**
 * @template T Extended interface of `VariantCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 * @template U Custom members you want to add to the format.
 */
export type FormatTemplate<T extends TunableCriteria, U extends Record<string, any> = {}> = {
    defaultCriteria: DefaultCriteria<T>;
    mounting?(queue: MountingTask[], mapper: MapperInstance, definedCriteria: T, mountedCriteria: MountedCriteria<T>): void;
    checking(queue: CheckingTask[], criteria: MountedCriteria<T>, value: unknown): null | string;
} & U;
export type Formats = typeof formats[keyof typeof formats];
