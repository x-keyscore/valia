import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { MountedCriteria, FormatCheckEntry } from "../types";
import type { TupleCriteria } from "./types";
import { AbstractFormat } from "../AbstractFormat";
export declare class TupleFormat<Criteria extends TupleCriteria> extends AbstractFormat<Criteria> {
    type: Criteria["type"];
    constructor();
    mountCriteria(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): MountedCriteria<Criteria>;
    getMountingTasks(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): SchemaMountTask[];
    checkEntry(criteria: MountedCriteria<Criteria>, entry: unknown): FormatCheckEntry;
    getCheckingTasks(criteria: MountedCriteria<Criteria>, entry: any): SchemaCheckTask[];
}
