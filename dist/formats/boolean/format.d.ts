import type { SchemaCheckTask, SchemaMountTask } from "../../schema/types";
import type { FormatCheckEntry, MountedCriteria } from "../types";
import type { BooleanCriteria } from "./types";
import { AbstractFormat } from "../AbstractFormat";
export declare class BooleanFormat<Criteria extends BooleanCriteria> extends AbstractFormat<Criteria> {
    type: Criteria["type"];
    constructor();
    mountCriteria(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): MountedCriteria<Criteria>;
    getMountingTasks(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): SchemaMountTask[];
    checkEntry(criteria: MountedCriteria<Criteria>, entry: unknown): FormatCheckEntry;
    getCheckingTasks(criteria: MountedCriteria<Criteria>, entry: any): SchemaCheckTask[];
}
