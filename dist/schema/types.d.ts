import type { FormatsCriteria, MountedCriteria } from "../formats";
export interface SchemaMountTask {
    definedCriteria: FormatsCriteria;
    mountedCriteria: MountedCriteria<FormatsCriteria>;
}
export interface SchemaCheckTask {
    criteria: MountedCriteria<FormatsCriteria>;
    /** Entry root or entry subpart */
    entry: any;
}
export interface SchemaCheckReject {
    type: string;
    /** `REJECT_<CATEGORY>_<DETAIL>` */
    code: string;
    label: string | undefined;
    message: string | undefined;
}
