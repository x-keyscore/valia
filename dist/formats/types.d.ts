import type { ArrayContext } from "./array/array";
import type { NumberContext } from "./number/number";
import type { RecordContext } from "./record/record";
import type { StringContext } from "./string/string";
import { formats } from "./formats";
type ConstructorFirstArgType<T> = T extends new (first: infer F, ...args: any[]) => any ? F : never;
/**
 * @template T Type name
 */
export interface TemplateCriteria<T extends string> {
    type: T;
    /**
     * @default true
     */
    require?: boolean;
    label?: string;
}
/**
 * @template T Criteria type
 * @template U Guard type
 * @template V (Optional) Predefined criteria
 */
export type TemplateContext<T extends FormatsCriteria, U, V extends Exclude<keyof T, keyof TemplateCriteria<T['type']>> = never> = {
    type: T['type'];
    guard: U;
    predefinedCriteria: Required<Pick<T, V>>;
};
export type FormatsContext<T extends FormatsCriteria> = RecordContext<T> | ArrayContext<T> | StringContext | NumberContext;
export type FormatsContextByCriteria<T extends FormatsCriteria> = {
    [U in FormatsContext<T>['type']]: Extract<FormatsContext<T>, {
        type: U;
    }>;
}[T['type']];
export type PredefinedCriteria<T extends FormatsCriteria> = NonNullable<FormatsContextByCriteria<T>['predefinedCriteria']>;
export interface FormatCheckerResult {
    error: {
        code: string;
    } | null;
}
export type Formats = typeof formats[keyof typeof formats];
export type FormatsInstance = InstanceType<Formats>;
export type FormatsCriteria = ConstructorFirstArgType<Formats>;
export type FormatsCriteriaTypeMap = {
    [T in FormatsCriteria['type']]: Extract<FormatsCriteria, {
        type: T;
    }>;
};
type FormatGuardDiscern<T extends FormatsCriteria> = FormatsContextByCriteria<T>['guard'];
export type FormatGuard<T extends FormatsCriteria> = T['require'] extends false ? FormatGuardDiscern<T> | undefined : NonNullable<FormatGuardDiscern<T>>;
export {};
