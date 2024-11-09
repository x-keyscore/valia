import { AbstractFormat } from "../AbstractFormat";
import { FormatCheckerResult, TemplateCriteria, TemplateContext, PredefinedCriteria } from "../types";
export interface StringCriteria extends TemplateCriteria<"string"> {
    accept?: RegExp;
    min?: number;
    max?: number;
    /**
     * @default true
     */
    trim?: boolean;
    /**
     * @default true
     */
    empty?: boolean;
}
export type StringContext = TemplateContext<StringCriteria, string, "empty" | "trim">;
export declare class StringFormat<Criteria extends StringCriteria> extends AbstractFormat<Criteria> {
    protected predefinedCriteria: PredefinedCriteria<Criteria>;
    constructor(criteria: Criteria);
    checker(input: unknown): FormatCheckerResult;
}
