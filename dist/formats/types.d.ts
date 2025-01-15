import type { ArrayConcreteTypes, ArrayGenericTypes } from "./array/types";
import type { BooleanConcreteTypes, BooleanGenericTypes } from "./boolean/types";
import type { NumberConcreteTypes, NumberGenericTypes } from "./number/types";
import type { RecordConcreteTypes, RecordGenericTypes } from "./record/types";
import type { StringConcreteTypes, StringGenericTypes } from "./string/types";
import type { StructConcreteTypes, StructGenericTypes } from "./struct/types";
import type { SymbolConcreteTypes, SymbolGenericTypes } from "./symbol/types";
import type { TupleConcreteTypes, TupleGenericTypes } from "./tuple/types";
import type { UnionConcreteTypes, UnionGenericTypes } from "./union/types";
import { SchemaCheckingTask, SchemaMountingTask } from "../schema";
import { isMountedSymbol, formats } from "./formats";
/**
 * Defines the criteria users must or can specify.
 *
 * @template T The name assigned to the format when the user selects the type.
 */
export interface VariantCriteriaTemplate<T extends string> {
    type: T;
    label?: string;
    message?: string;
    /** @default false */
    optional?: boolean;
    /** @default false */
    nullable?: boolean;
}
/**
 * @template T Extended interface of `VariantCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 *
 * @template U Default properties for those defined in `T` that must
 * be specified in the superclass reference within the format class.
 *
 * @template V Properties that will be added to or override
 * the format criteria after the mounting process.
 */
export interface ConcreteTypesTemplate<T extends VariantCriteriaTemplate<string>, U extends Partial<T>, V> {
    type: T['type'];
    variantCriteria: T;
    defaultCriteria: U;
    mountedCritetia: V;
}
export type FormatsConcreteTypes = ArrayConcreteTypes | BooleanConcreteTypes | NumberConcreteTypes | RecordConcreteTypes | StringConcreteTypes | StructConcreteTypes | SymbolConcreteTypes | TupleConcreteTypes | UnionConcreteTypes;
export type FormatsConcreteTypesMap = {
    [U in FormatsConcreteTypes['type']]: Extract<FormatsConcreteTypes, {
        type: U;
    }>;
};
/**
 * @template T Extended interface of `VariantCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 *
 * @template U A type that takes a generic parameter extending
 * 'VariantCriteria'. It is used to determine the type validated
 * by the format it represents, based on the criteria defined
 * by the user.
 */
export interface GenericTypesTemplate<T extends VariantCriteriaTemplate<string>, U> {
    type: T['type'];
    guard: U;
}
export type FormatsGenericTypes<T extends VariantCriteria> = ArrayGenericTypes<T> | BooleanGenericTypes<T> | NumberGenericTypes<T> | RecordGenericTypes<T> | StringGenericTypes<T> | StructGenericTypes<T> | SymbolGenericTypes<T> | TupleGenericTypes<T> | UnionGenericTypes<T>;
export type FormatsGenericTypesMap<T extends VariantCriteria> = {
    [U in FormatsGenericTypes<T>['type']]: Extract<FormatsGenericTypes<T>, {
        type: U;
    }>;
};
export type VariantCriteria = {
    [U in FormatsConcreteTypes['type']]: Extract<FormatsConcreteTypes, {
        type: U;
    }>['variantCriteria'];
}[FormatsConcreteTypes['type']];
export type VariantCriteriaMap = {
    [U in VariantCriteria['type']]: Extract<VariantCriteria, {
        type: U;
    }>;
};
export type DefaultCriteria<T extends VariantCriteria> = {
    [U in T['type']]: FormatsConcreteTypesMap[U]['defaultCriteria'];
}[T['type']];
export interface DefaulGlobalCriteria {
    [isMountedSymbol]: boolean;
    optional: boolean;
    nullable: boolean;
}
export type MountedCriteria<T extends VariantCriteria> = {
    [U in T['type']]: DefaulGlobalCriteria & FormatsConcreteTypesMap[U]['defaultCriteria'] & T & FormatsConcreteTypesMap[U]['mountedCritetia'];
}[T['type']];
export type FormatsGuard<T extends VariantCriteria> = T['optional'] extends false ? FormatsGenericTypesMap<T>[T['type']]['guard'] | undefined : FormatsGenericTypesMap<T>[T['type']]['guard'];
/**
 * @template T Extended interface of `VariantCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 * @template U Custom property you want to add to the format.
 */
export type FormatTemplate<T extends VariantCriteria, U extends Record<string, any> = {}> = {
    defaultCriteria?: DefaultCriteria<T>;
    mountCriteria(definedCriteria: T, mountedCriteria: MountedCriteria<T>): MountedCriteria<T>;
    getMountingTasks?(definedCriteria: T, mountedCriteria: MountedCriteria<T>): SchemaMountingTask[];
    checkValue(criteria: MountedCriteria<T>, value: unknown): null | string;
    getCheckingTasks?(criteria: MountedCriteria<T>, value: any): SchemaCheckingTask[];
} & U;
export type CheckValueResult = null | string;
export type Formats = typeof formats[keyof typeof formats];
