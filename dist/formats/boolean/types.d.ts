import { TemplateCriteria, TemplateContext } from "../types";
export interface BooleanCriteria extends TemplateCriteria<"boolean"> {
}
type BooleanGuard = boolean;
export type BooleanContext = TemplateContext<BooleanCriteria, BooleanGuard, {}, {}>;
export {};
