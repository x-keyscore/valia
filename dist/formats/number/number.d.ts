import { AbstractFormat } from "../AbstractFormat";
import { FormatCheckerResult, TemplateCriteria, TemplateContext, PredefinedCriteria } from "../types";
export interface NumberCriteria extends TemplateCriteria<"number"> {
    accept?: RegExp;
    min?: number;
    max?: number;
}
export type NumberContext = TemplateContext<NumberCriteria, number>;
export declare class NumberFormat<Criteria extends NumberCriteria> extends AbstractFormat<Criteria> {
    protected predefinedCriteria: PredefinedCriteria<Criteria>;
    constructor(criteria: Criteria);
    checker(input: unknown): FormatCheckerResult;
}
