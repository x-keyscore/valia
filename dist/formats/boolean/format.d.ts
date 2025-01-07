import type { SchemaCheckTask, SchemaMountTask } from "../../schema/types";
import type { FormatCheckValueResult, MountedCriteria } from "../types";
import type { BooleanCriteria } from "./types";
import { AbstractFormat } from "../AbstractFormat";
export declare class BooleanFormat<Criteria extends BooleanCriteria> extends AbstractFormat<Criteria> {
    constructor();
    mountCriteria(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): MountedCriteria<Criteria>;
    getMountingTasks(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): SchemaMountTask[];
    checkValue(mountedCriteria: MountedCriteria<Criteria>, value: unknown): FormatCheckValueResult;
    getCheckingTasks(mountedCriteria: MountedCriteria<Criteria>, value: any): SchemaCheckTask[];
}
