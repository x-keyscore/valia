import type { ArrayConcreteTypes, ArrayGenericTypes } from "./array/types";
import type { BooleanConcreteTypes, BooleanGenericTypes } from "./boolean/types";
import type { NumberConcreteTypes, NumberGenericTypes } from "./number/types";
import type { RecordConcreteTypes, RecordGenericTypes } from "./record/types";
import type { StringConcreteTypes, StringGenericTypes } from "./string/types";
import type { StructConcreteTypes, StructGenericTypes } from "./struct/types";
import type { SymbolConcreteTypes, SymbolGenericTypes } from "./symbol/types";
import type { TupleConcreteTypes, TupleGenericTypes } from "./tuple/types";
import type { UnionConcreteTypes, UnionGenericTypes } from "./union/types";
import type { CheckingTask, MountingTask, CheckerReject, metadataSymbol } from "../services";
import { RegistryManager, RegistryPathSegments } from "../managers";
import { formats } from "./formats";
export interface SetableCriteriaBase {
    label?: string;
    message?: string;
    /** @default false */
    nullable?: boolean;
    /** @default false */
    undefinable?: boolean;
}
/**
 * Defines the criteria users must or can specify.
 *
 * @template T The name assigned to the format when the user selects the type.
 */
export interface SetableCriteriaTemplate<T extends string> extends SetableCriteriaBase {
    type: T;
}
/**
 * @template T Extended interface of `SetableCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 *
 * @template U Default properties for those defined in `T` that must
 * be specified in the superclass reference within the format class.
 */
export interface ConcreteTypesTemplate<T extends SetableCriteriaTemplate<string>, U extends Partial<T>> {
    type: T['type'];
    setableCriteria: T;
    defaultCriteria: U;
}
export type FormatsConcreteTypes = ArrayConcreteTypes | BooleanConcreteTypes | NumberConcreteTypes | RecordConcreteTypes | StringConcreteTypes | StructConcreteTypes | SymbolConcreteTypes | TupleConcreteTypes | UnionConcreteTypes;
export type FormatsConcreteTypesMap = {
    [U in FormatsConcreteTypes['type']]: Extract<FormatsConcreteTypes, {
        type: U;
    }>;
};
/**
 * @template T Extended interface of `SetableCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 *
 * @template U A type that takes a generic parameter extending
 * 'SetableCriteria'. It is used to determine the type validated
 * by the format it represents, based on the criteria defined
 * by the user.
 *
 * @template V Properties that will be added to or override
 * the format criteria after the mounting process.
 */
export interface GenericTypesTemplate<T extends SetableCriteriaTemplate<string>, U, V> {
    type: T['type'];
    mountedCriteria: U;
    guardedCriteria: V;
}
export type FormatsGenericTypes<T extends SetableCriteria> = T extends SetableCriteriaMap['array'] ? ArrayGenericTypes<T> : T extends SetableCriteriaMap['boolean'] ? BooleanGenericTypes<T> : T extends SetableCriteriaMap['number'] ? NumberGenericTypes<T> : T extends SetableCriteriaMap['record'] ? RecordGenericTypes<T> : T extends SetableCriteriaMap['string'] ? StringGenericTypes<T> : T extends SetableCriteriaMap['struct'] ? StructGenericTypes<T> : T extends SetableCriteriaMap['symbol'] ? SymbolGenericTypes<T> : T extends SetableCriteriaMap['tuple'] ? TupleGenericTypes<T> : T extends SetableCriteriaMap['union'] ? UnionGenericTypes<T> : never;
export type SetableCriteria = FormatsConcreteTypes['setableCriteria'];
export type SetableCriteriaMap = {
    [U in SetableCriteria['type']]: Extract<SetableCriteria, {
        type: U;
    }>;
};
export type SetableCriteriaOmit<T extends keyof SetableCriteriaMap> = Omit<SetableCriteriaMap, T> extends infer U ? U[keyof U] : never;
export interface StaticDefaultCriteria {
    nullable: boolean;
    undefinable: boolean;
}
export type DefaultCriteria<T extends SetableCriteria = SetableCriteria> = {
    [U in T['type']]: FormatsConcreteTypesMap[U]['defaultCriteria'];
}[T['type']];
export interface StaticMountedCriteria {
    [metadataSymbol]: {
        registryKey: MountedCriteria;
        registry: RegistryManager['registry'];
    };
}
export type MountedCriteria<T extends SetableCriteria = SetableCriteria> = T extends any ? StaticDefaultCriteria & FormatsConcreteTypesMap[T['type']]['defaultCriteria'] & Omit<T, keyof FormatsGenericTypes<T>['mountedCriteria']> & FormatsGenericTypes<T>['mountedCriteria'] & StaticMountedCriteria : never;
export type GuardedCriteria<T extends SetableCriteria> = FormatsGenericTypes<T>['guardedCriteria'];
/**
 * @template T Extended interface of `VariantCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 * @template U Custom members you want to add to the format.
 */
export type FormatTemplate<T extends SetableCriteria, U extends Record<string, any> = {}> = {
    defaultCriteria: DefaultCriteria<T>;
    mounting?(queue: MountingTask[], path: RegistryPathSegments, criteria: T): void;
    checking(queue: CheckingTask[], path: RegistryPathSegments, criteria: MountedCriteria<T>, value: unknown): null | CheckerReject['code'];
} & U;
export type Formats = typeof formats[keyof typeof formats];
