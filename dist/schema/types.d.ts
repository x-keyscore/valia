import type { VariantCriteria, MountedCriteria, FormatsGuard } from "../formats";
import { Schema } from "./Schema";
export interface SchemaMountingTask {
    definedCriteria: VariantCriteria;
    mountedCriteria: MountedCriteria<VariantCriteria>;
}
export interface CheckingTaskLink {
    finished: boolean;
    totalLinks: number;
    totalRejected: number;
}
export interface SchemaCheckingTask {
    criteria: MountedCriteria<VariantCriteria>;
    value: unknown;
    link?: CheckingTaskLink;
}
export interface SchemaCheckerReject {
    type: string;
    /** `REJECT_<CATEGORY>_<DETAIL>` */
    path: string;
    code: string;
    label: string | undefined;
    message: string | undefined;
}
export type SchemaCheck = SchemaCheckerReject | null;
export type SchemaGuard<T> = T extends Schema<infer U> ? FormatsGuard<U> : never;
