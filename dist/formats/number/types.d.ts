import { TemplateContext, TemplateCriteria } from "../types";
export interface NumberCriteria extends TemplateCriteria<"number"> {
    accept?: RegExp;
    min?: number;
    max?: number;
}
type NumberGuard = number;
export type NumberContext = TemplateContext<NumberCriteria, NumberGuard, {}, {}>;
export {};
