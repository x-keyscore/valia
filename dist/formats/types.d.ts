import type { BooleanContext, BooleanCriteria } from "./boolean/types";
import type { NumberCriteria, NumberContext } from "./number/types";
import type { RecordContext, RecordCriteria } from "./record/types";
import type { StringCriteria, StringContext } from "./string/types";
import type { StructCriteria, StructContext } from "./struct/types";
import type { SymbolContext, SymbolCriteria } from "./symbol/types";
import type { TupleCriteria, TupleContext } from "./tuple/types";
import type { ArrayContext, ArrayCriteria } from "./array/types";
import { globalCriteria } from "./AbstractFormat";
import { formats } from "./formats";
/**
 * This template defines the basic parameters of the criteria.
 */
export interface TemplateCriteria {
    label?: string;
    message?: string;
    /**
     * @default true
     */
    require?: boolean;
}
export type PredefinedCriteria<T extends FormatsCriteria> = FormatsContextByCriteria<T>['predefinedCriteria'];
export type MountedCriteria<T extends FormatsCriteria> = typeof globalCriteria & PredefinedCriteria<T> & T & FormatsContextByCriteria<T>['mountedCriteria'];
/**
 * This template streamlines the definition of type parameters for formats.
 *
 * @template T Criteria of the type that the user will be able to define.
 * @template U Guard type used to provide the data type if it is valid.
 * @template V Type of criteria that must be included in the final
 * criteria, even if they were not defined by the user.
 * @template W Type of criteria that will be added to the criteria
 * visible to the user after the said criteria have been mounted.
 */
export type TemplateContext<T extends FormatsCriteria, U, V extends Partial<T>, W> = {
    type: T['type'];
    guard: U;
    predefinedCriteria: V;
    mountedCriteria: W;
};
export type FormatCheckEntry = null | string;
export type Formats = typeof formats[keyof typeof formats];
export type FormatsInstances = InstanceType<Formats>;
export type FormatsCriteria = ArrayCriteria | TupleCriteria | RecordCriteria | StructCriteria | NumberCriteria | StringCriteria | SymbolCriteria | BooleanCriteria;
export type FormatsCriteriaMap = {
    [T in FormatsCriteria['type']]: Extract<FormatsCriteria, {
        type: T;
    }>;
};
export type FormatsContext<T extends FormatsCriteria> = ArrayContext<T> | TupleContext<T> | RecordContext<T> | StructContext<T> | NumberContext | StringContext | SymbolContext | BooleanContext;
export type FormatsContextByCriteria<T extends FormatsCriteria> = {
    [U in FormatsContext<T>['type']]: Extract<FormatsContext<T>, {
        type: U;
    }>;
}[T['type']];
type FormatsGuardDiscern<T extends FormatsCriteria> = FormatsContextByCriteria<T>['guard'];
export type FormatsGuard<T extends FormatsCriteria> = T['require'] extends false ? FormatsGuardDiscern<T> | undefined : NonNullable<FormatsGuardDiscern<T>>;
export {};
