import { AbstractFormat } from "../AbstractFormat";
import type { FormatCheckerResult, TemplateCriteria, TemplateContext, FormatsCriteria, PredefinedCriteria, FormatGuard } from "../types";
export interface RecordCriteria extends TemplateCriteria<"record"> {
    record: Record<string, FormatsCriteria>;
}
type NotRequireKeyMap<T extends RecordCriteria['record']> = {
    [P in keyof T]-?: T[P]['require'] extends false ? P : never;
}[keyof T];
type NotRequireToOptional<T extends RecordCriteria['record']> = Partial<Pick<T, NotRequireKeyMap<T>>> & Pick<T, Exclude<keyof T, NotRequireKeyMap<T>>>;
type RecordGuard<T extends FormatsCriteria> = T extends RecordCriteria ? {
    [K in keyof NotRequireToOptional<T['record']>]: FormatGuard<T['record'][K]>;
} : never;
export type RecordContext<T extends FormatsCriteria> = TemplateContext<RecordCriteria, RecordGuard<T>>;
export declare class RecordFormat<Criteria extends RecordCriteria> extends AbstractFormat<Criteria> {
    protected predefinedCriteria: PredefinedCriteria<Criteria>;
    constructor(criteria: Criteria);
    protected hasRequiredKeys(inputRecord: Record<string, unknown>): boolean;
    protected hasDefinedKeys(inputRecord: Record<string, unknown>): boolean;
    checker(input: unknown): FormatCheckerResult;
}
export {};
