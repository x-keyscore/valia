import type { FormatsCriteria, FormatsCriteriaMap, FormatsGuard, MountedCriteria, TemplateContext, TemplateCriteria } from "../types";
import type { SchemaInstance, SchemaInstanceExtractCriteria } from "../../schema";
type RecordCriteriaKeys = FormatsCriteriaMap["string" | "boolean"];
export interface RecordCriteria extends TemplateCriteria<"record"> {
    key: RecordCriteriaKeys;
    value: FormatsCriteria | SchemaInstance;
    min?: number;
    max?: number;
    empty?: boolean;
}
type RecordGuard<T extends FormatsCriteria> = T extends RecordCriteria ? FormatsGuard<T['key']> extends infer K ? K extends string | symbol ? {
    [P in K]: FormatsGuard<SchemaInstanceExtractCriteria<T['value']>>;
} : never : never : never;
export type RecordContext<T extends FormatsCriteria> = TemplateContext<RecordCriteria, RecordGuard<T>, {
    empty: boolean;
}, {
    key: MountedCriteria<RecordCriteriaKeys>;
    value: MountedCriteria<FormatsCriteria>;
}>;
export {};
