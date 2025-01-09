import { FormatsCriteria, FormatsGuard, TemplateCriteria, TemplateContext, MountedCriteria } from "../types";
export interface ArrayCriteria extends TemplateCriteria {
    type: "array";
    item: FormatsCriteria;
    min?: number;
    max?: number;
    /**
     * @default true
     */
    empty?: boolean;
}
/**
 * The `ArrayGuard` type must represent the format type once it has been validated,
 * and must also tell us whether the current criteria type represented by `T`
 * is the one it should be. In this context `T` must be of type `ArrayCriteria`.
 *
 * `ArrayCriteria` is always only called by the type `FormatGuard`,
 * which represents the root of the recursive loop of types.
 *
 * @template T - The current criteria type of the recursive loop.
 */
type ArrayGuard<T extends FormatsCriteria> = T extends ArrayCriteria ? FormatsGuard<T['item']>[] : never;
export type ArrayContext<T extends FormatsCriteria> = TemplateContext<ArrayCriteria, ArrayGuard<T>, {
    empty: boolean;
}, {
    item: MountedCriteria<ArrayCriteria>;
}>;
export {};
