import type { ArrayClassicTypes, ArrayGenericTypes, ArraySetableCriteria } from "./array/types";
import type { BooleanClassicTypes, BooleanGenericTypes, BooleanSetableCriteria } from "./boolean/types";
import type { NumberClassicTypes, NumberGenericTypes, NumberSetableCriteria } from "./number/types";
import type { RecordClassicTypes, RecordGenericTypes, RecordSetableCriteria } from "./record/types";
import type { StringClassicTypes, StringGenericTypes, StringSetableCriteria } from "./string/types";
import type { StructClassicTypes, StructGenericTypes, StructSetableCriteria } from "./struct/types";
import type { SymbolClassicTypes, SymbolGenericTypes, SymbolSetableCriteria } from "./symbol/types";
import type { TupleClassicTypes, TupleGenericTypes, TupleSetableCriteria } from "./tuple/types";
import type { UnionClassicTypes, UnionGenericTypes, UnionSetableCriteria } from "./union/types";
import type { CheckingTask, MountingTask, Rejection, metadataSymbol } from "../services";
import { RegistryManager, RegistryValue } from "../managers";
import { nativeFormats } from "./formats";
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
export interface ClassicTypesTemplate<Setable extends SetableCriteriaTemplate<string>, Default extends Partial<Setable>> {
    setableCriteria: Setable;
    defaultCriteria: Default;
}
export interface FormatClassicTypes<T extends keyof FormatClassicTypes = keyof FormatClassicTypes<any>> {
    array: ArrayClassicTypes<T>;
    boolean: BooleanClassicTypes;
    number: NumberClassicTypes;
    record: RecordClassicTypes<T>;
    string: StringClassicTypes;
    struct: StructClassicTypes<T>;
    symbol: SymbolClassicTypes;
    tuple: TupleClassicTypes<T>;
    union: UnionClassicTypes<T>;
}
export type KeyofFormatClassicTypes = keyof FormatClassicTypes;
/**
 * @template Mounted A type that takes a generic parameter extending
 * 'SetableCriteria'. It is used to determine the type validated
 * by the format it represents, based on the criteria defined
 * by the user.
 *
 * @template Guarded Properties that will be added to or override
 * the format criteria after the mounting process.
 */
export interface GenericTypesTemplate<Mounted, Guarded> {
    mountedCriteria: Mounted;
    guardedCriteria: Guarded;
}
export interface FormatGenericTypes<T extends SetableCriteria = SetableCriteria> {
    array: T extends ArraySetableCriteria ? ArrayGenericTypes<T> : never;
    boolean: T extends BooleanSetableCriteria ? BooleanGenericTypes : never;
    number: T extends NumberSetableCriteria ? NumberGenericTypes<T> : never;
    record: T extends RecordSetableCriteria ? RecordGenericTypes<T> : never;
    string: T extends StringSetableCriteria ? StringGenericTypes<T> : never;
    struct: T extends StructSetableCriteria ? StructGenericTypes<T> : never;
    symbol: T extends SymbolSetableCriteria ? SymbolGenericTypes : never;
    tuple: T extends TupleSetableCriteria ? TupleGenericTypes<T> : never;
    union: T extends UnionSetableCriteria ? UnionGenericTypes<T> : never;
}
export type SetableCriteria<T extends keyof FormatClassicTypes = keyof FormatClassicTypes> = FormatClassicTypes<T>[T]['setableCriteria'];
export interface StaticDefaultCriteria {
    nullable: boolean;
    undefinable: boolean;
}
export type DefaultCriteria<T extends keyof FormatClassicTypes = keyof FormatClassicTypes> = FormatClassicTypes<T>[T]['defaultCriteria'];
export interface StaticMountedCriteria {
    [metadataSymbol]: {
        registry: RegistryManager['registry'];
        saveNode: MountedCriteria;
    };
}
export type MountedCriteria<T extends SetableCriteria = SetableCriteria> = T extends any ? StaticDefaultCriteria & FormatClassicTypes[T['type']]['defaultCriteria'] & Omit<T, keyof FormatGenericTypes<T>[T['type']]['mountedCriteria']> & FormatGenericTypes<T>[T['type']]['mountedCriteria'] & StaticMountedCriteria : never;
export type GuardedCriteria<T extends SetableCriteria = SetableCriteria> = FormatGenericTypes<T>[keyof FormatGenericTypes]['guardedCriteria'];
/**
 * @template T Extended interface of `SettableCriteriaTemplate` that
 * defines the format criteria users must or can specify.
 * @template U Custom members you want to add to the format.
 */
export type FormatTemplate<T extends SetableCriteria, U extends Record<string, any> = {}> = {
    defaultCriteria: FormatClassicTypes[T['type']]['defaultCriteria'];
    mounting?(queue: MountingTask[], path: RegistryValue['partPaths'], criteria: T): void;
    /**
     * **Warning:**
     * Do not fill the queue if a rejection can still be emitted by the function,
     * as it could disrupt the effect of the checking hooks.
     */
    checking(queue: CheckingTask[], path: RegistryValue['partPaths'], criteria: MountedCriteria<T>, value: unknown): Rejection['code'] | null;
} & U;
export type NativeFormats = typeof nativeFormats;
