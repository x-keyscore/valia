import { TemplateCriteria, TemplateContext } from "../types";
import { strings } from "../../testers";
type ExtractParamsType<T extends (input: any, params?: any) => any> = T extends (input: any, params: infer U) => any ? U : never;
type StringCriteriaKinds<Kinds extends Record<string, any>> = {
    [K in keyof Kinds]: {
        name: K;
        params: ExtractParamsType<Kinds[K]>;
    };
}[keyof Kinds];
export interface StringCriteria extends TemplateCriteria<"string"> {
    kind?: StringCriteriaKinds<typeof strings>;
    accept?: RegExp;
    min?: number;
    max?: number;
    /**
     * @default true
     */
    empty?: boolean;
    /**
     * @default false
     */
    trim?: boolean;
}
type StringGuard = string;
export type StringContext = TemplateContext<StringCriteria, StringGuard, {
    trim: boolean;
    empty: boolean;
}, {}>;
export {};
