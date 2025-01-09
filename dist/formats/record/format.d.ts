import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { FormatCheckEntry, MountedCriteria } from "../types";
import type { RecordCriteria } from "./types";
import { AbstractFormat } from "../AbstractFormat";
export declare class RecordFormat<Criteria extends RecordCriteria> extends AbstractFormat<Criteria> {
    type: Criteria["type"];
    constructor();
    mountCriteria(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): MountedCriteria<Criteria>;
    getMountingTasks(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): SchemaMountTask[];
    objectLength(obj: object): number;
    checkEntry(criteria: MountedCriteria<Criteria>, entry: unknown): FormatCheckEntry;
    getCheckingTasks(criteria: MountedCriteria<Criteria>, entry: any): SchemaCheckTask[];
}
