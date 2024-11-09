import { AbstractFormat } from "../AbstractFormat";
import type { FormatCheckerResult, TemplateCriteria, TemplateContext, FormatsCriteria, PredefinedCriteria, FormatGuard } from "../types";
export interface ArrayCriteria extends TemplateCriteria<"array"> {
    array: [FormatsCriteria, ...FormatsCriteria[]];
    min?: number;
    max?: number;
    /**
     * @default true
     */
    empty?: boolean;
}
/**
 * The ArrayGuard type must represent the format type once it has been validated,
 * and must also tell us whether the current criteria type represented by `T`
 * is the one it should be. In this context `T` must be of type `ArrayCriteria`.
 *
 * `ArrayCriteria` is always only called by the type `FormatGuard`,
 * which represents the recursive loop.
 *
 * @template T - The current criteria type of the recursive loop `FormatGuard`
 */
type ArrayGuard<T extends FormatsCriteria> = T extends ArrayCriteria ? FormatGuard<T['array'][0]>[] : never;
export type ArrayContext<T extends FormatsCriteria> = TemplateContext<ArrayCriteria, ArrayGuard<T>, "empty">;
export declare class ArrayFormat<Criteria extends ArrayCriteria> extends AbstractFormat<Criteria> {
    protected predefinedCriteria: PredefinedCriteria<Criteria>;
    constructor(criteria: Criteria);
    checker(input: unknown): FormatCheckerResult;
}
export {};
