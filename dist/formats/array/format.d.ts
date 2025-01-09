import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { FormatCheckEntry, MountedCriteria } from "../types";
import type { ArrayCriteria } from "./types";
import { AbstractFormat } from "../AbstractFormat";
export declare class ArrayFormat<Criteria extends ArrayCriteria> extends AbstractFormat<Criteria> {
    type: Criteria["type"];
    constructor();
    mountCriteria(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): MountedCriteria<Criteria>;
    getMountingTasks(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): SchemaMountTask[];
    checkEntry(criteria: MountedCriteria<Criteria>, entry: unknown): FormatCheckEntry;
    getCheckingTasks(criteria: MountedCriteria<Criteria>, entry: any): SchemaCheckTask[];
}
