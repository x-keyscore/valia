import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { MountedCriteria, FormatCheckValueResult } from "../types";
import type { ArrayCriteria } from "./types";
import { AbstractFormat } from "../AbstractFormat";
export declare class ArrayFormat<Criteria extends ArrayCriteria> extends AbstractFormat<Criteria> {
    constructor();
    mountCriteria(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): MountedCriteria<Criteria>;
    getMountingTasks(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): SchemaMountTask[];
    checkValue(mountedCriteria: MountedCriteria<Criteria>, value: unknown): FormatCheckValueResult;
    getCheckingTasks(mountedCriteria: MountedCriteria<Criteria>, value: any): SchemaCheckTask[];
}
