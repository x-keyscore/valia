import { FormatsCriteria, FormatsGuard, TemplateCriteria, TemplateContext, MountedCriteria } from "../types";
export interface TupleCriteria extends TemplateCriteria<"tuple"> {
    tuple: [FormatsCriteria, ...FormatsCriteria[]];
    min?: number;
    max?: number;
    /**
     * @default true
     */
    empty?: boolean;
}
/**
 * The `TupleGuard` type must represent the format type once it has been validated,
 * and must also tell us whether the current criteria type represented by `T`
 * is the one it should be. In this context `T` must be of type `TupleCriteria`.
 *
 * `TupleCriteria` is always only called by the type `FormatGuard`,
 * which represents the recursive loop.
 *
 * @template T - The current criteria type of the recursive loop `FormatGuard`
 */
type TupleGuard<T extends FormatsCriteria> = T extends TupleCriteria ? {
    [Index in keyof T['tuple']]: FormatsGuard<Extract<T['tuple'][Index], FormatsCriteria>>;
} : never;
export type TupleContext<T extends FormatsCriteria> = TemplateContext<TupleCriteria, TupleGuard<T>, {
    empty: boolean;
}, {
    tuple: [MountedCriteria<TupleCriteria>, ...MountedCriteria<TupleCriteria>[]];
}>;
export {};
