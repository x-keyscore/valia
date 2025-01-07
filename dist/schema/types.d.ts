import type { FormatsCriteria } from "../formats";
import type { MountedCriteria } from "../formats/types";
import { Schema } from "./Schema";
export interface SchemaMountTask {
    definedCriteria: FormatsCriteria;
    mountedCriteria: MountedCriteria<FormatsCriteria>;
}
export interface SchemaCheckTask {
    mountedCriteria: MountedCriteria<FormatsCriteria>;
    value: any;
}
export interface SchemaCheckerResult {
    error: {
        code: string;
        label: string | undefined;
    } | null;
}
/** Important to avoid the type error: `is referenced directly or indirectly in its own type annotation` */
type SchemaType = typeof Schema;
export type SchemaInstance = InstanceType<SchemaType>;
export type SchemaInstanceExtractCriteria<T extends FormatsCriteria | SchemaInstance> = T extends FormatsCriteria ? T : T extends SchemaInstance ? T['mountedCriteria'] : never;
export {};
