import type { TupleCriteria, TupleContext } from "./tuple/types";
import type { StructCriteria, StructContext } from "./struct/types";
import type { NumberCriteria, NumberContext } from "./number/types";
import type { StringCriteria, StringContext } from "./string/types";
import { globalCriteria } from "./AbstractFormat";
import { formats } from "./formats";
import { ArrayContext, ArrayCriteria } from "./array/types";
import { RecordContext, RecordCriteria } from "./record/types";
import { BooleanContext, BooleanCriteria } from "./boolean/types";
import { SymbolContext, SymbolCriteria } from "./symbol/types";
/**
 * @template T Type name
 */
export interface TemplateCriteria<T extends string> {
    type: T;
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
 * @template T Criteria type
 * @template U Guard type
 * @template V (Optional) Predefined criteria
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
type DiscernFormatsGuard<T extends FormatsCriteria> = FormatsContextByCriteria<T>['guard'];
export type FormatsGuard<T extends FormatsCriteria> = T['require'] extends false ? DiscernFormatsGuard<T> | undefined : NonNullable<DiscernFormatsGuard<T>>;
export {};
