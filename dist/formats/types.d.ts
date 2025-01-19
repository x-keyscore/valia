import type { ArrayConcreteTypes, ArrayGenericTypes } from "./array/types";
import type { BooleanConcreteTypes, BooleanGenericTypes } from "./boolean/types";
import type { NumberConcreteTypes, NumberGenericTypes } from "./number/types";
import type { RecordConcreteTypes, RecordGenericTypes } from "./record/types";
import type { StringConcreteTypes, StringGenericTypes } from "./string/types";
import type { StructConcreteTypes, StructGenericTypes } from "./struct/types";
import type { SymbolConcreteTypes, SymbolGenericTypes } from "./symbol/types";
import type { TupleConcreteTypes, TupleGenericTypes } from "./tuple/types";
import type { UnionConcreteTypes, UnionGenericTypes } from "./union/types";
import { SchemaCheckingTask, SchemaMountingTask, metadataSymbol, Register } from "../schema";
import { formats } from "./formats";
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
export interface DefaultVariantCriteria {
    optional: boolean;
    nullable: boolean;
}
export type RegisterInstance = InstanceType<typeof Register>;
export interface DefaultMountedCriteria {
    [metadataSymbol]: {
        mountingTime: string;
        register: RegisterInstance;
    };
}
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
export type DefaultCriteria<T extends VariantCriteria = VariantCriteria> = {
    [U in T['type']]: FormatsConcreteTypesMap[U]['defaultCriteria'];
}[T['type']];
export type MountedCriteria<T extends VariantCriteria> = {
    [U in T['type']]: DefaultVariantCriteria & FormatsConcreteTypesMap[U]['defaultCriteria'] & T & FormatsConcreteTypesMap[U]['mountedCritetia'] & DefaultMountedCriteria;
}[T['type']];
export type FormatsGuard<T extends VariantCriteria> = T['type'] extends FormatsGenericTypes<T>['type'] ? FormatsGenericTypes<T>['guard'] : never;
/**
 * @template T Extended interface of `VariantCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 * @template U Custom property you want to add to the format.
 */
export type FormatTemplate<T extends VariantCriteria, U extends Record<string, any> = {}> = {
    checkCriteria?: {
        [K in keyof Omit<T, 'type'>]: (x: unknown) => boolean;
    };
    defaultCriteria: DefaultCriteria<T>;
    mounting?(queue: SchemaMountingTask[], register: RegisterInstance, definedCriteria: T, mountedCriteria: MountedCriteria<T>): void;
    checking(queue: SchemaCheckingTask[], criteria: MountedCriteria<T>, value: unknown): null | string;
} & U;
export type CheckValueResult = null | string;
export type Formats = typeof formats[keyof typeof formats];
