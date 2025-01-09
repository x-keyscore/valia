import { TemplateContext, TemplateCriteria } from "../types";
export interface NumberCriteria extends TemplateCriteria {
    type: "number";
    min?: number;
    max?: number;
}
type NumberGuard = number;
export type NumberContext = TemplateContext<NumberCriteria, NumberGuard, {}, {}>;
export {};
